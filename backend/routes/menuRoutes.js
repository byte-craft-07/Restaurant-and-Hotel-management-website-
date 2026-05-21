const express = require("express");
const {
  createMenuItem,
  getMenuItems,
  getSingleMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
router.get("/", getMenuItems);

router.get("/:id", getSingleMenuItem);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createMenuItem
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateMenuItem
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteMenuItem);

module.exports = router;