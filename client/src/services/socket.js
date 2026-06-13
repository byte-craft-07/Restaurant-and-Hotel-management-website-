import { io } from "socket.io-client";

const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL;
const DEPLOYED_SOCKET_URL =
  "https://restaurant-and-hotel-management-website.onrender.com";
const isLocalhostUrl = (value = "") =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const SOCKET_URL =
  configuredSocketUrl &&
  (import.meta.env.DEV || !isLocalhostUrl(configuredSocketUrl))
    ? configuredSocketUrl
    : DEPLOYED_SOCKET_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  reconnectionAttempts: 4,
  reconnectionDelay: 1200,
});

export default socket;
