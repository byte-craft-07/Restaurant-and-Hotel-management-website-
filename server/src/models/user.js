const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "waiter", "kitchen"],
      default: "customer",
    },

    orderCount: {
      type: Number,
      default: 0,
    },

    customerId: {
      type: String,
      unique: true,
      sparse: true,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    offerNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("save", function () {
  if (this.role === "customer" && !this.customerId) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.customerId = `CUST-${random}`;
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
