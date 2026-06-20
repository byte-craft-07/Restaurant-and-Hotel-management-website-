import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const LOCAL_API_URL = "http://localhost:5000/api";
const DEPLOYED_API_URL =
  "https://restaurant-and-hotel-management-website.onrender.com/api";
const isLocalhostUrl = (value = "") =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

export const API_BASE_URL =
  configuredApiUrl && (import.meta.env.DEV || !isLocalhostUrl(configuredApiUrl))
    ? configuredApiUrl
    : import.meta.env.DEV
      ? LOCAL_API_URL
      : DEPLOYED_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
