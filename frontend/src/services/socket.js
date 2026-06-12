import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

const socket = io(SOCKET_URL, {
  withCredentials: true,
  reconnectionAttempts: 4,
  reconnectionDelay: 1200,
});

export default socket;
