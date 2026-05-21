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
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VerificationSession",
      required: true,
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
      enum: ["pending", "accepted", "preparing", "served", "cancelled"],
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
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
