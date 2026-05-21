const express = require("express");
const {
  createServiceRequest,
  getServiceRequests,
  updateServiceRequestStatus,
} = require("../controllers/serviceRequestController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createServiceRequest);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "waiter"),
  getServiceRequests
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "waiter"),
  updateServiceRequestStatus
);

module.exports = router;
