const mongoose = require("mongoose");

const tableRoomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["table", "room"],
      required: true,
    },

    number: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      default: "",
    },

    qrToken: {
      type: String,
      required: true,
      unique: true,
    },

    qrUrl: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TableRoom", tableRoomSchema);