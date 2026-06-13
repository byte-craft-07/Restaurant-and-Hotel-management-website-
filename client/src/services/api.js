import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const DEPLOYED_API_URL =
  "https://restaurant-and-hotel-management-website.onrender.com/api";
const isLocalhostUrl = (value = "") =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

export const API_BASE_URL =
  configuredApiUrl && (import.meta.env.DEV || !isLocalhostUrl(configuredApiUrl))
    ? configuredApiUrl
    : DEPLOYED_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
