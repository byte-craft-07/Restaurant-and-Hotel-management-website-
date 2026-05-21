const express = require("express");

const {
  createTableRoom,
  getTableRooms,
  getQrContext,
  getPendingVerificationSessions,
  scanQrToken,
  verifySessionCode,
  updateTableRoom,
  deleteTableRoom,
} = require("../controllers/tableRoomController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer starts verification from a scanned QR
router.get("/scan/:token", protect, scanQrToken);

// Customer verifies session code
router.post("/verify", protect, verifySessionCode);

// Customer reads table/room context without generating a verification code
router.get("/context/:token", protect, getQrContext);

router.get(
  "/verification/pending",
  protect,
  authorizeRoles("admin", "waiter"),
  getPendingVerificationSessions
);

// Admin routes
router.post("/", protect, authorizeRoles("admin"), createTableRoom);
router.get("/", protect, authorizeRoles("admin"), getTableRooms);
router.put("/:id", protect, authorizeRoles("admin"), updateTableRoom);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTableRoom);

module.exports = router;
