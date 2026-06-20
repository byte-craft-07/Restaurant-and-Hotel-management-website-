const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

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
  "https://restaurant-and-hotel-management-web.vercel.app",
  "https://restaurant-and-hotel-management-website-byte-craft.vercel.app",
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
      hostname.endsWith(".onrender.com") ||
      (hostname.startsWith("restaurant-and-hotel-management-") &&
        hostname.endsWith("-byte-craft.vercel.app"))
    );
  } catch {
    return false;
  }
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Socket CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  },
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
