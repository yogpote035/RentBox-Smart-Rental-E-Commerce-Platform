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
      if (res.status === 200) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", res.data.username);
        setIsAuthenticated(true); //  update state
        return true;
      }
      if (res.status === 208) {
        toast.error("This Phone Or Mail User Already Exists");
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const login = async (payload) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        payload
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", res.data.username);
        setIsAuthenticated(true); // update state
        return true;
      }
      // user found but password not match
      if (res.status === 208) {
        toast.error("You Enter Wrong Password");
        setIsAuthenticated(false); // update state
        return false;
      }

      // user Not found
      if (res.status === 204) {
        toast.error("User Not Found, Please Check Your Credentials");
        setIsAuthenticated(false); // update state
        return false;
      }

      // user is Admin
      if (res.status === 203) {
        toast.error("You are not General User to access this resource");
        setIsAuthenticated(false); // update state
        return false;
      }
    } catch (err) {
      setIsAuthenticated(false);
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsAuthenticated(false); // update state
    toast.warning("You Logged Out Successfully");
  };

  return (
    <UserContext.Provider value={{ signup, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
