import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OrderContext from "./OrderContext";
import { format, isBefore, startOfDay } from "date-fns";

const OrderState = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  //  Rent Now
  const RentNow = async (productId, quantity, from, to) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/order`,
        { productId, quantity, from, to },
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

  //  Fetch My Orders
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

  //  Cancel an Order
  const cancelOrder = async (orderId) => {
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

  const CheckAvailability = async (productId, from, to) => {
    if (!from || !to) {
      setAvailabilityMessage("Please select both dates.");
      setIsAvailable(null);
      return;
    }

    const today = startOfDay(new Date());
    const fromDate = startOfDay(new Date(from));

    if (isBefore(fromDate, today)) {
      setAvailabilityMessage("Start date must be today or in the future.");
      toast.error("Start date can't be in the past.");
      return;
    }

    const validDate = isBefore(new Date(from), new Date(to));
    if (!validDate) {
      setAvailabilityMessage("Please select Valid Date.");
      return toast.error("Select Valid Date");
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/order/check-availability`,
        {
          productId: productId,
          from,
          to,
        },
        {
          headers: {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        }
      );
      if (res.status === 208) {
        const nextDate = format(
          new Date(res?.data?.nextAvailable),
          "dd/MM/yyyy"
        );
        setAvailabilityMessage(
          `❌ Already booked for selected dates. Available on : ${nextDate}`
        );
        toast.error(res?.data?.message || "Not available");

        setIsAvailable(false);
        return;
      }

      setAvailabilityMessage("✔ Product is available for selected dates.");
      setIsAvailable(true);
      toast.success("Available to rent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Not available");
    }
  };

  return (
    <OrderContext.Provider
      value={{
        RentNow,
        fetchMyOrders,
        cancelOrder,
        orders,
        isAvailable,
        availabilityMessage,
        CheckAvailability,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
