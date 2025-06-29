import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserState = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const signup = async (payload) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        payload
      );
      toast.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setIsAuthenticated(true); // ✅ update state
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const login = async (payload) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        payload
      );
      toast.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setIsAuthenticated(true); // ✅ update state
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false); // ✅ update state
    toast.warning("You Logged Out Successfully");
  };

  return (
    <UserContext.Provider value={{ signup, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
