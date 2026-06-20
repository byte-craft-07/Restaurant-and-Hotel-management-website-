const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const {
  categories: originalCategories,
  menuItems: originalMenuItems,
} = require("../data/originalMenuCatalog");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", "..", ".env") });

const temporarySeedItemNames = [
  "Paneer Butter Masala",
  "Butter Chicken",
  "Dal Tadka",
  "Chicken Biryani",
  "Veg Pulao",
  "Classic Chicken Burger",
  "Gulab Jamun Cheesecake",
  "Cold Coffee",
];

const seedOriginalMenu = async () => {
  try {
    const mongoUrl = process.env.ATLASDB_URL;

    if (!mongoUrl) {
      throw new Error("ATLASDB_URL is missing in server/.env");
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    // Veg Pulao only existed in the temporary seed, so it is a safe migration marker.
    const temporarySeedExists = await MenuItem.exists({ name: "Veg Pulao" });

    if (temporarySeedExists) {
      await MenuItem.deleteMany({ name: { $in: temporarySeedItemNames } });
    }

    const categoryIds = {};

    for (const category of originalCategories) {
      const record = await Category.findOneAndUpdate(
        { name: category.name },
        {
          $setOnInsert: {
            name: category.name,
            description: category.description || "",
            isActive: true,
          },
        },
        { returnDocument: "after", upsert: true, runValidators: true }
      );
      categoryIds[category.name] = record._id;
    }

    let inserted = 0;

    for (const item of originalMenuItems) {
      const { category, ...details } = item;
      const result = await MenuItem.updateOne(
        { name: item.name },
        {
          $setOnInsert: {
            ...details,
            category: categoryIds[category.name],
            isAvailable: item.isAvailable !== false,
          },
        },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount) inserted += 1;
    }

    if (temporarySeedExists) {
      await Category.deleteOne({ name: "Quick Bites" });
    }

    console.log(
      `Original menu linked: ${originalCategories.length} categories ready, ${inserted} dishes added.`
    );
  } catch (error) {
    console.error("Original menu migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedOriginalMenu();
