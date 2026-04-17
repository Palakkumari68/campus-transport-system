import React, { createContext, useContext, useState } from "react";
import { login as loginAPI, register as registerAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (formData) => {
    const res = await loginAPI(formData);

    const { token, id, name, email, role } = res.data;

    const userData = {
      id,
      name,
      email,
      role,
      token,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (data) => {
    const res = await registerAPI(data);

    if (res.data.token) {
      const userData = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
      };

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}