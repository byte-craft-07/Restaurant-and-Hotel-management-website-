const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/user");

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUrl = process.env.ATLASDB_URL;

    if (!mongoUrl) {
      throw new Error("ATLASDB_URL is missing in server/.env");
    }

    await mongoose.connect(mongoUrl);

    const email = process.env.ADMIN_EMAIL || "admin@restro.com";
    const phone = process.env.ADMIN_PHONE || "9999999999";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingAdmin) {
      existingAdmin.name = existingAdmin.name || "Admin";
      existingAdmin.email = email;
      existingAdmin.phone = phone;
      existingAdmin.role = "admin";
      existingAdmin.password = password;

      await existingAdmin.save();
      console.log(`Admin user updated: ${email}`);
    } else {
      await User.create({
        name: "Admin",
        email,
        phone,
        password,
        role: "admin",
      });
      console.log(`Admin user created: ${email}`);
    }

    console.log("Login password:", password);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
