const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    budget: {
      type: Number,
      default: 0,
    },
    tableRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableRoom",
      default: null,
    },
    tablePreference: {
      type: String,
      default: "",
    },
    foodPreferences: {
      type: String,
      default: "",
    },
    decorationPreferences: {
      type: String,
      default: "",
    },
    specialRequests: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "planning", "confirmed", "cancelled"],
      default: "new",
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventBooking", eventBookingSchema);
