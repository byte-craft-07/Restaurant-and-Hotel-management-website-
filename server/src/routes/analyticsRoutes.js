const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAnalytics);

module.exports = router;
