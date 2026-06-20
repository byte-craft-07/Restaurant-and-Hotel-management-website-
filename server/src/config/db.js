const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
  const mongoUrl = process.env.ATLASDB_URL;

  if (!mongoUrl) {
    throw new Error(
      "ATLASDB_URL is missing. Add it in Vercel Environment Variables or server/.env."
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUrl, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error(`MongoDB Error: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
