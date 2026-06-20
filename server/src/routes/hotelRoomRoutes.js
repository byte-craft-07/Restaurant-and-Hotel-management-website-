const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomStatusSummary,
} = require("../controllers/hotelRoomController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getRooms);
router.get("/status-summary", protect, authorizeRoles("admin"), getRoomStatusSummary);
router.get("/:id", getRoomById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 6),
  createRoom
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 6),
  updateRoom
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteRoom);

module.exports = router;
