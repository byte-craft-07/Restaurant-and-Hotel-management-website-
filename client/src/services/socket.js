import { io } from "socket.io-client";

const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL;
const isLocalhostUrl = (value = "") =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const SOCKET_URL =
  configuredSocketUrl &&
  (import.meta.env.DEV || !isLocalhostUrl(configuredSocketUrl))
    ? configuredSocketUrl
    : import.meta.env.DEV
      ? "http://localhost:5000"
      : window.location.origin;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  reconnectionAttempts: 4,
  reconnectionDelay: 1200,
});

export default socket;
