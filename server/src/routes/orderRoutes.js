const express = require("express");

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  findOrderByCashCode,
  markCashPaymentPaid,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, authorizeRoles("admin", "waiter", "kitchen"), getAllOrders);

router.get(
  "/cash-code/:code",
  protect,
  authorizeRoles("admin", "waiter"),
  findOrderByCashCode
);

router.put(
  "/cash-code/:code/paid",
  protect,
  authorizeRoles("admin", "waiter"),
  markCashPaymentPaid
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "waiter", "kitchen"),
  updateOrderStatus
);

module.exports = router;
