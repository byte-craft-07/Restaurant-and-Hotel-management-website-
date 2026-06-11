const orderRoutes = require("./routes/orderRoutes");
const tableRoomRoutes = require("./routes/tableRoomRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const eventBookingRoutes = require("./routes/eventBookingRoutes");


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const parseOrigins = (...values) =>
  values
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseOrigins(
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS,
  "http://localhost:5173"
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/table-rooms", tableRoomRoutes);
app.use("/api/rooms", tableRoomRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/event-bookings", eventBookingRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hotel Room Service Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
