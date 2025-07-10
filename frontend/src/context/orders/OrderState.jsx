import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OrderContext from "./OrderContext";
import { format, isBefore, startOfDay } from "date-fns";
import { FaLessThanEqual } from "react-icons/fa";

const OrderState = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewedOrders, setReviewedOrders] = useState({});

  // add review
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  //  Rent Now
  const RentNow = async (productId, quantity, from, to) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      //Get user and check address
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/${userId}`,
        {
          headers: { token },
        }
      );

      const user = userRes.data;

      if (!user.address || user.address.length === 0) {
        toast.error("Please add your address before renting a product.");
        return "add-address"; 
      }

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
    setIsAvailable(FaLessThanEqual); //FaLessThanEqual [react icon]
    if (!from || !to) {
      setAvailabilityMessage("Please select both dates.");
      return setIsAvailable(false);
    }

    const today = startOfDay(new Date());
    const fromDate = startOfDay(new Date(from));

    if (isBefore(fromDate, today)) {
      setAvailabilityMessage("Start date must be today or in the future.");
      setIsAvailable(false);
      return toast.error("Start date can't be in the past.");
    }

    const validDate = isBefore(new Date(from), new Date(to));
    if (!validDate) {
      setAvailabilityMessage("Please select Valid Date.");
      setIsAvailable(false);
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

  const fetchReviews = async (id) => {
    if (!id) {
      return toast.warning("Product Id Not Found");
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/review/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
            userid: localStorage.getItem("userId"),
          },
        }
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
    }
  };

  const addReview = async (reviewOrderId, reviewMessage, reviewRating) => {
    try {
      const order = orders.find((o) => o._id === reviewOrderId);
      if (!order) {
        return toast.warning("Something Went Wrong Wait Some Time");
      }
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/review/add`,
        {
          product: order?.product?._id,
          order: reviewOrderId,
          message: reviewMessage,
          rating: reviewRating,
        },
        {
          headers: {
            userid: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Review submitted!");
      setShowReviewForm(false);
      setReviewOrderId(null);
      setReviewMessage("");
      setReviewRating(0);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };
  // one time call for all order id's
  const checkReviewedByUser = async () => {
    const userId = localStorage.getItem("userId");

    if (!orders || orders.length === 0) return;

    const orderIds = orders.map((order) => order._id);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/review/check-reviewed-batch/`,
        { orderIds },
        {
          headers: {
            userid: userId,
            token: localStorage.getItem("token"),
          },
        }
      );

      setReviewedOrders(res.data);
    } catch (error) {
      console.error("Error checking reviewed orders:", error);
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
        setIsAvailable,
        availabilityMessage,
        CheckAvailability,
        fetchReviews,
        reviews,
        addReview,
        setShowReviewForm,
        setReviewRating,
        setReviewMessage,
        setReviewOrderId,
        showReviewForm,
        reviewRating,
        reviewMessage,
        reviewOrderId,
        checkReviewedByUser,
        reviewedOrders,
        setReviewedOrders,
        setAvailabilityMessage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
