const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAnalytics);

module.exports = router;
