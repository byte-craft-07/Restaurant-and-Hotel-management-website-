const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    tableRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TableRoom",
      default: null,
    },

    hotelRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelRoom",
      default: null,
    },

    roomBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomBooking",
      default: null,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "waiter",
        "food",
        "water",
        "water-bottle",
        "towels",
        "cleaning",
        "housekeeping",
        "laundry",
        "bill",
        "spa",
        "taxi",
        "breakfast",
        "event",
        "concierge",
        "assistance",
      ],
      default: "waiter",
    },

    estimatedAmount: {
      type: Number,
      default: 0,
      min: 0,
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
