const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: ["waiter", "water", "bill", "assistance"],
      default: "waiter",
    },

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    status: {
      type: String,
      enum: ["pending", "acknowledged", "resolved", "cancelled"],
      default: "pending",
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
