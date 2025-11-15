// src/context/AuthContext.jsx
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextValue";
import axios from "../lib/axios";

const getInitialToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("token") || "";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getInitialToken);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((value) => {
    setToken(value);

    if (typeof window === "undefined") {
      return;
    }

    if (value) {
      localStorage.setItem("token", value);
      axios.defaults.headers.common.Authorization = `Bearer ${value}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      try {
        const { data } = await axios.get("/me");
        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (isMounted) {
          persistToken("");
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [persistToken, token]);

  const login = async (email, password) => {
    const { data } = await axios.post("/login", { email, password });
    persistToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async ({ name, email, password }) => {
    const { data } = await axios.post("/register", { name, email, password });
    persistToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch {
      // ignore network failures when logging out
    } finally {
      persistToken("");
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (!token) return null;
    const { data } = await axios.get("/me");
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
