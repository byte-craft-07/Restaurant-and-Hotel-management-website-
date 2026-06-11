const Order = require("../models/Order");
const User = require("../models/user");

const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name phone email customerId")
      .populate("tableRoom", "type number")
      .lean();

    const customers = await User.find({ role: "customer" })
      .select("-password")
      .lean();

    const paidOrders = orders.filter(
      (order) => !order.paymentStatus || order.paymentStatus === "paid"
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (order.finalAmount || order.totalAmount || 0),
      0
    );

    const servedOrders = orders.filter((order) => order.status === "served");
    const pendingOrders = orders.filter((order) => order.status === "pending");

    const itemMap = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }

        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const topCustomers = customers
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        servedOrders: servedOrders.length,
        pendingOrders: pendingOrders.length,
        topItems,
        topCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAnalytics };
