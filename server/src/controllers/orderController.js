const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const VerificationSession = require("../models/VerificationSession");
const User = require("../models/user");

const generateCashCode = () =>
  `CASH-${Math.floor(100000 + Math.random() * 900000)}`;

const normalizeCashCode = (value = "") => {
  const code = value.trim().toUpperCase();

  if (!code) return "";
  return code.startsWith("CASH-") ? code : `CASH-${code}`;
};

const createOrder = async (req, res) => {
  try {
    const { sessionId, items, numberOfPeople, note, paymentMethod } = req.body;

    if (!sessionId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Session ID and order items are required",
      });
    }

    const session = await VerificationSession.findById(sessionId).populate(
      "tableRoom"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (!session.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Session is not verified",
      });
    }

    if (session.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session expired",
      });
    }

    if (session.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Session already used",
      });
    }

    let orderItems = [];
    let totalAmount = 0;
    const customer = await User.findById(req.user._id);

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is not available`,
        });
      }

      const quantity = item.quantity || 1;
      const itemTotal = menuItem.price * quantity;

      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
    }

    const discountPercent = customer?.discountPercent || 0;
    const discountAmount = Math.round((totalAmount * discountPercent) / 100);
    const finalAmount = totalAmount - discountAmount;
    const safePaymentMethod = paymentMethod === "cash" ? "cash" : "online";
    const paymentStatus =
      safePaymentMethod === "cash" ? "pending_cash" : "paid";

    let cashCode;

    if (safePaymentMethod === "cash") {
      let isUnique = false;

      while (!isUnique) {
        cashCode = generateCashCode();
        const existingOrder = await Order.findOne({ cashCode });
        isUnique = !existingOrder;
      }
    }

    const order = await Order.create({
      customer: req.user._id,
      tableRoom: session.tableRoom._id,
      session: session._id,
      items: orderItems,
      numberOfPeople,
      totalAmount,
      discountPercent,
      discountAmount,
      finalAmount,
      note,
      status: safePaymentMethod === "cash" ? "payment_pending" : "pending",
      paymentMethod: safePaymentMethod,
      paymentStatus,
      cashCode,
      paidAt: safePaymentMethod === "online" ? new Date() : undefined,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        orderCount: 1,
        totalSpent: safePaymentMethod === "online" ? finalAmount : 0,
      },
    });

    session.isUsed = true;
    await session.save();

    const fullOrder = await Order.findById(order._id)
      .populate("customer", "name phone email")
      .populate("tableRoom", "type number label")
      .populate("items.menuItem", "name price");

    const io = req.app.get("io");
    if (io) {
      io.emit("new_order", fullOrder);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: fullOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name phone email")
      .populate("tableRoom", "type number label")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("tableRoom", "type number label")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("customer", "name phone email")
      .populate("tableRoom", "type number label");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("order_status_updated", order);
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findOrderByCashCode = async (req, res) => {
  try {
    const code = normalizeCashCode(req.params.code);

    const order = await Order.findOne({ cashCode: code })
      .populate("customer", "name phone email")
      .populate("tableRoom", "type number label");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No bill found for this cash code",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markCashPaymentPaid = async (req, res) => {
  try {
    const code = normalizeCashCode(req.params.code);

    const existingOrder = await Order.findOne({ cashCode: code });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "No bill found for this cash code",
      });
    }

    const wasAlreadyPaid = existingOrder.paymentStatus === "paid";

    const order = await Order.findOneAndUpdate(
      { cashCode: code },
      {
        paymentStatus: "paid",
        status:
          existingOrder.status === "payment_pending"
            ? "pending"
            : existingOrder.status,
        paidAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate("customer", "name phone email")
      .populate("tableRoom", "type number label");

    if (!wasAlreadyPaid) {
      await User.findByIdAndUpdate(order.customer._id || order.customer, {
        $inc: {
          totalSpent: order.finalAmount || order.totalAmount || 0,
        },
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("order_payment_updated", order);
      io.emit("order_status_updated", order);
    }

    res.json({
      success: true,
      message: "Payment complete. Order confirmed",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  findOrderByCashCode,
  markCashPaymentPaid,
};
