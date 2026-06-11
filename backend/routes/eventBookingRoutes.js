const express = require("express");
const {
  createEventBooking,
  getAllEventBookings,
  getMyEventBookings,
  updateEventBooking,
} = require("../controllers/eventBookingController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("customer"), createEventBooking);
router.get("/my", protect, getMyEventBookings);
router.get("/", protect, authorizeRoles("admin"), getAllEventBookings);
router.put("/:id", protect, authorizeRoles("admin"), updateEventBooking);

module.exports = router;
