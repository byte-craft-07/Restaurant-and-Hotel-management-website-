import { API_BASE_URL } from "../services/api";

export const resolveMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return `${API_BASE_URL.replace(/\/api$/, "")}${path}`;
};
