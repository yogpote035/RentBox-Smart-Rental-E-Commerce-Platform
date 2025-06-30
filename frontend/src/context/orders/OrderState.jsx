import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // 🔄 Rent Now
  const RentNow = async (productId, quantity) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/order`,
        { productId, quantity },
        {
          headers: {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Product rented successfully!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rent");
    }
  };

  // 📦 Fetch My Orders
  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/order/my-orders`,
        {
          headers: {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  // ❌ Cancel an Order
  const cancelOrder = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to cancel this rental?");
    if (!confirm) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/order/${orderId}`,
        {
          headers: {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        }
      );
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order cancelled successfully!");
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <OrderContext.Provider value={{ RentNow, fetchMyOrders, cancelOrder, orders }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
