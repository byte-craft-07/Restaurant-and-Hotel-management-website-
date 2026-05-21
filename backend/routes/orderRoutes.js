const express = require("express");

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, authorizeRoles("admin", "waiter", "kitchen"), getAllOrders);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "waiter", "kitchen"),
  updateOrderStatus
);

module.exports = router;
