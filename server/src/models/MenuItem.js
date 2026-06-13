const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    isVegan: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    spiceLevel: {
      type: String,
      enum: ["none", "mild", "medium", "spicy"],
      default: "mild",
    },

    popularity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    preparationTime: {
      type: Number,
      default: 15,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
