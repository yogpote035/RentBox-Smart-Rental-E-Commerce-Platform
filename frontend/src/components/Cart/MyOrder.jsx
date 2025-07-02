import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import OrderContext from "../../context/orders/OrderContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ConfirmDialog from "../ConfirmDialog";

function MyOrder() {
  const { fetchMyOrders, cancelOrder, orders } = useContext(OrderContext);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null); // For dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleOpenConfirm = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    setDisabledButtons((prev) => ({ ...prev, [selectedOrderId]: true }));
    setIsDialogOpen(false);
    await cancelOrder(selectedOrderId);
    toast.success("Order cancelled");
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
                  src={order.product?.image || "/utils/fallback.png"}
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

                <p>
                  Rent Period:{" "}
                  <span className="text-indigo-600 font-medium">
                    {format(new Date(order.from), "dd MMM yyyy")} ➜{" "}
                    {format(new Date(order.to), "dd MMM yyyy")}
                  </span>
                </p>

                <button
                  onClick={() => handleOpenConfirm(order._id)}
                  disabled={!!disabledButtons[order._id]}
                  className={`mt-4 px-4 py-2 rounded transition w-full ${
                    disabledButtons[order._id]
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  type="button"
                >
                  {disabledButtons[order._id]
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        content="Are you sure you want to cancel this rental order?"
      />
    </div>
  );
}

export default MyOrder;
