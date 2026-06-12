import { API_BASE_URL } from "../services/api";

export const getAuthErrorMessage = (error, fallback) => {
  const serverMessage = error.response?.data?.message;

  if (serverMessage) return serverMessage;

  if (error.code === "ECONNABORTED") {
    return "Backend response timeout. Please check that the backend server is running.";
  }

  if (!error.response) {
    return `Backend API is not reachable. Check VITE_API_URL: ${API_BASE_URL}`;
  }

  return fallback;
};
