const express = require("express");
const {
  createStaffUser,
  deleteStaffUser,
  getCustomers,
  getCustomerDetails,
  getStaffUsers,
  updateCustomerOffer,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/staff", protect, authorizeRoles("admin"), getStaffUsers);
router.post("/staff", protect, authorizeRoles("admin"), createStaffUser);
router.delete("/staff/:id", protect, authorizeRoles("admin"), deleteStaffUser);

router.get("/customers", protect, authorizeRoles("admin"), getCustomers);

router.get(
  "/customers/:id",
  protect,
  authorizeRoles("admin"),
  getCustomerDetails
);

router.put(
  "/customers/:id/offer",
  protect,
  authorizeRoles("admin"),
  updateCustomerOffer
);

module.exports = router;
