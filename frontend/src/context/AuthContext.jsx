import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Restore auth state safely on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch {
        // corrupted storage → hard reset
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        setAdmin(null);
      }
    }

    setLoading(false);
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      setAdmin(res.data.admin);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
