const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUrl = process.env.ATLASDB_URL;

    if (!mongoUrl) {
      throw new Error("ATLASDB_URL is missing in backend/.env");
    }

    const conn = await mongoose.connect(mongoUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
