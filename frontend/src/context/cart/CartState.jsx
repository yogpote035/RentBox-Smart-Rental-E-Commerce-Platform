import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CartContext from "./CartContext";
import UserContext from "../Authentication/UserContext";
import { useNavigate } from "react-router-dom";
const CartState = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { handleUnauthorized } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
        headers: {
          userId: localStorage.getItem("userId"),
          token: localStorage.getItem("token"),
        },
      });
      setCartItems(res.data.items);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      console.error("Cart fetch failed");
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        { productId, quantity },
        {
          headers: {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        },
      );
      setCartItems(res.data.items);
      toast.success("Added to cart");
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/remove`,
        { productId },
        {
          headers: {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        },
      );
      setCartItems(res.data.items);
      toast.success("Removed from cart");
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      toast.error("Remove failed");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, fetchCart, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartState;
