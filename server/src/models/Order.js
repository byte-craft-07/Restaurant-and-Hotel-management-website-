const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tableRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableRoom",
      default: null,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VerificationSession",
      default: null,
    },

    items: [orderItemSchema],

    numberOfPeople: {
      type: Number,
      default: 1,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "payment_pending",
        "pending",
        "accepted",
        "preparing",
        "served",
        "cancelled",
      ],
      default: "pending",
    },

    note: {
      type: String,
      default: "",
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending_cash", "failed"],
      default: "paid",
    },

    cashCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
