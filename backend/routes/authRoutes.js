const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);

// test admin route
router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

// test service staff route
router.get("/waiter-only", protect, authorizeRoles("waiter", "admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Service Staff/Admin",
  });
});

module.exports = router;
