const express = require("express");
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getRoomBillingSummary,
} = require("../controllers/roomBookingController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("customer", "admin"), createBooking);
router.get("/", protect, authorizeRoles("customer", "admin"), getBookings);
router.get("/:id", protect, authorizeRoles("customer", "admin"), getBookingById);
router.get("/:id/billing", protect, authorizeRoles("customer", "admin"), getRoomBillingSummary);
router.patch("/:id/status", protect, authorizeRoles("admin"), updateBookingStatus);

module.exports = router;
