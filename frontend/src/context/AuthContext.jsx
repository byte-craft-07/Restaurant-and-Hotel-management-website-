import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    setUser(res.data.user);

    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
  setUser(null);
};

  const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
  } catch {
    setUser(null);
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
