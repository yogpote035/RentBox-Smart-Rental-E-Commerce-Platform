import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CartContext from "./CartContext";

const CartState = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
        headers: { userId: localStorage.getItem("userId") },
      });
      setCartItems(res.data.items);
    } catch (err) {
      console.error("Cart fetch failed");
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        { productId, quantity },
        { headers: { userId: localStorage.getItem("userId") } }
      );
      setCartItems(res.data.items);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/remove`,
        { productId },
        { headers: { userId: localStorage.getItem("userId") } }
      );
      setCartItems(res.data.items);
      toast.success("Removed from cart");
    } catch {
      toast.error("Remove failed");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartState;
