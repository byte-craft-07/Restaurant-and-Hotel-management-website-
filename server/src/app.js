const orderRoutes = require("./routes/orderRoutes");
const tableRoomRoutes = require("./routes/tableRoomRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const eventBookingRoutes = require("./routes/eventBookingRoutes");
const hotelRoomRoutes = require("./routes/hotelRoomRoutes");
const roomBookingRoutes = require("./routes/roomBookingRoutes");

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const app = express();

const parseOrigins = (...values) =>
  values
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseOrigins(
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
  process.env.CORS_ORIGINS,
  "http://localhost:5173"
);

const isAllowedOrigin = (origin = "") => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".onrender.com")
    );
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", async (req, res) => {
  try {
    const connection = await connectDB();

    res.json({
      success: true,
      status: "ok",
      database: "connected",
      host: connection.host,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "db_error",
      database: "not_connected",
      message: error.message,
      env: {
        hasAtlasDbUrl: Boolean(process.env.ATLASDB_URL),
      },
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api", async (req, res, next) => {
  if (req.path === "/health") {
    next();
    return;
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      env: {
        hasAtlasDbUrl: Boolean(process.env.ATLASDB_URL),
      },
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/table-rooms", tableRoomRoutes);
app.use("/api/rooms", tableRoomRoutes);
app.use("/api/hotel-rooms", hotelRoomRoutes);
app.use("/api/room-bookings", roomBookingRoutes);
app.use("/api/orders", orderRoutes);
const uploadsDir = path.join(process.cwd(), "uploads");

app.use("/uploads", express.static(uploadsDir));
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/event-bookings", eventBookingRoutes);

const frontendDistPath =
  process.env.FRONTEND_DIST_PATH || path.join(__dirname, "..", "..", "client", "dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      next();
      return;
    }

    res.sendFile(frontendIndexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Hotel Room Service Backend is running",
      frontend: "Run npm run build from the project root to serve the frontend.",
    });
  });
}

module.exports = app;
