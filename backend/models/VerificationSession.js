const mongoose = require("mongoose");

const verificationSessionSchema = new mongoose.Schema(
  {
    tableRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableRoom",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verificationCode: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    cartPreview: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    numberOfPeople: {
      type: Number,
      default: 1,
    },

    note: {
      type: String,
      default: "",
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "VerificationSession",
  verificationSessionSchema
);
