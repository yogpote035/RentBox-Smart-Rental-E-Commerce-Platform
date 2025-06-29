import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
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
      console.error("Failed to fetch orders", err);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this rental?"
    );
    if (!confirmDelete) return;

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
      toast.success("Order removed successfully!");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      toast.error("Failed to remove order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-indigo-700 mb-8 border-b pb-2">
        My Rental Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 text-lg">
          You haven't rented any products yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 overflow-hidden relative"
            >
              <Link to={`/product/${order.product?._id}`}>
                <img
                  src={order.product?.image || "/fallback.jpg"}
                  alt={order.product?.name}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {order.product?.name}
                </h3>

                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Quantity:</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Price:</span>
                  <span className="font-medium">₹{order.product?.price}</span>
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  Rented on: {new Date(order.createdAt).toLocaleString()}
                </div>

                <button
                  onClick={() => handleRemoveOrder(order._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrder;
