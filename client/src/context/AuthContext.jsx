import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getStoredToken = () => localStorage.getItem("token");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);

    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);

    return res.data;
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
    }
  };

  const getMe = async () => {
    if (!getStoredToken()) {
      clearSession();
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isWaiter: user?.role === "waiter",
        isKitchen: user?.role === "kitchen",
        isCustomer: user?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
