const express = require("express");

const {
  createTableRoom,
  getTableRooms,
  getQrContext,
  scanQrToken,
  updateTableRoom,
  deleteTableRoom,
} = require("../controllers/tableRoomController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Guest starts a room service session from a scanned QR
router.get("/scan/:token", protect, scanQrToken);

// Guest reads room context
router.get("/context/:token", protect, getQrContext);

// Admin routes
router.post("/", protect, authorizeRoles("admin"), createTableRoom);
router.get("/", protect, authorizeRoles("admin", "customer", "waiter"), getTableRooms);
router.put("/:id", protect, authorizeRoles("admin"), updateTableRoom);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTableRoom);

module.exports = router;
