const User = require("../models/User");
const Order = require("../models/Order");

const generateCustomerId = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const random = Math.floor(100000 + Math.random() * 900000);
    const customerId = `CUST-${random}`;
    const exists = await User.exists({ customerId });

    if (!exists) return customerId;
  }

  throw new Error("Unable to generate customer ID");
};

const ensureCustomerId = async (customer) => {
  if (customer.customerId || customer.role !== "customer") return customer;

  const customerId = await generateCustomerId();

  return User.findByIdAndUpdate(
    customer._id,
    { customerId },
    { new: true }
  ).select("-password");
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });
    const customersWithIds = await Promise.all(customers.map(ensureCustomerId));

    res.json({
      success: true,
      count: customersWithIds.length,
      customers: customersWithIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerDetails = async (req, res) => {
  try {
    let customer = await User.findById(req.params.id).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer = await ensureCustomerId(customer);

    const orders = await Order.find({ customer: req.params.id })
      .populate("tableRoom", "type number label")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      customer,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCustomerOffer = async (req, res) => {
  try {
    const { discountPercent, offerNote } = req.body;
    const normalizedDiscount = Math.min(
      100,
      Math.max(0, Number(discountPercent) || 0)
    );

    const customer = await User.findByIdAndUpdate(
      req.params.id,
      {
        discountPercent: normalizedDiscount,
        offerNote: offerNote || "",
      },
      { new: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer offer updated",
      customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStaffUsers = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["waiter", "kitchen"] } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStaffUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, password and role are required",
      });
    }

    if (!["waiter", "kitchen"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Only waiter or kitchen staff can be created here",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      });
    }

    const staffUser = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    const safeStaffUser = await User.findById(staffUser._id).select(
      "-password"
    );

    res.status(201).json({
      success: true,
      message: `${role === "waiter" ? "Waiter" : "Kitchen"} account created`,
      staff: safeStaffUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStaffUser = async (req, res) => {
  try {
    const staffUser = await User.findOneAndDelete({
      _id: req.params.id,
      role: { $in: ["waiter", "kitchen"] },
    }).select("-password");

    if (!staffUser) {
      return res.status(404).json({
        success: false,
        message: "Staff user not found",
      });
    }

    res.json({
      success: true,
      message: "Staff user deleted",
      staff: staffUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStaffUser,
  deleteStaffUser,
  getCustomers,
  getCustomerDetails,
  getStaffUsers,
  updateCustomerOffer,
};
