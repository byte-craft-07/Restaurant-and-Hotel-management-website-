const mongoose = require("mongoose");

const roomBookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelRoom",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    roomAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
      default: "pending",
      index: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    billingSummary: {
      roomBooking: { type: Number, default: 0 },
      foodOrders: { type: Number, default: 0 },
      roomService: { type: Number, default: 0 },
      laundry: { type: Number, default: 0 },
      eventBooking: { type: Number, default: 0 },
      otherServices: { type: Number, default: 0 },
      finalAmount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomBooking", roomBookingSchema);
