import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

const UserState = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    // console.log("State Update calling refresh token function");

    const interval = setInterval(() => {
      GenerateRefreshToken();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);
  const signup = async (payload) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        payload,
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
        payload,
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

  const googleLogin = async (navigate) => {
    try {
      toast.success("Redirecting to Google Sign-In...");
      const result = await signInWithPopup(auth, googleProvider);

      // Firebase ID Token
      const firebaseToken = await result.user.getIdToken();

      // Send token to backend
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google-login`,
        { firebaseToken },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      toast.success("Google login successful");
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Popup closed before login");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups");
      } else {
        toast.error("Google login failed");
      }
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsAuthenticated(false); // update state
    toast.warning("You Logged Out Successfully");
  };

  const handleUnauthorized = (navigate) => {
    localStorage.clear();
    setIsAuthenticated(false);
    toast.error("Session expired. Please login again.");
    if (navigate) {
      navigate("/login");
    }
  };

  const GenerateRefreshToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userId");

      if (!token || !userID) return;

      // console.log("🔄 Old token:", token);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`,
        {
          token: token,
          id: userID,
        },
      );

      const newToken = res?.data?.refreshToken;

      if (!newToken) throw new Error("No refresh token received");
      localStorage.setItem("token", newToken);
      // console.log("✅ New token applied");
      // console.log("new Token:", newToken);
    } catch (err) {
      console.log("❌ Refresh failed", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
        handleUnauthorized();
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        handleUnauthorized,
        signup,
        login,
        googleLogin,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
