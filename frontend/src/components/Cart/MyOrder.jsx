import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import OrderContext from "../../context/orders/OrderContext";
import { toast } from "react-toastify";
import { format, isBefore, isAfter } from "date-fns";
import ConfirmDialog from "../ConfirmDialog";
import axios from "axios";
import Rating from "@mui/material/Rating";

function MyOrder() {
  const {
    fetchMyOrders,
    cancelOrder,
    orders,
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
  } = useContext(OrderContext);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Review Modal State

  useEffect(() => {
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      checkReviewedByUser();
    }
  }, [orders]);
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

  const handleLeaveReview = async () => {
    if (!reviewMessage || reviewRating === 0) {
      return toast.error("Please fill out all review fields.");
    }
    const success = await addReview(reviewOrderId, reviewMessage, reviewRating);

    if (success) {
      setReviewedOrders((prev) => ({
        ...prev,
        [reviewOrderId]: true,
      }));
    }
  };

  const handleDownloadReceipt = (orderId) => {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/order/generate-receipt?orderId=${orderId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl text-center font-bold text-indigo-700 mb-8 border-b pb-2">
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
              <Link to={`/rental/${order.product?._id}`}>
                <img
                  src={order.product?.image || "/utils/fallback.png"}
                  alt={order.product?.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              {/* Concise Rental Details */}
              <div className="text-sm px-4 text-gray-700 space-y-1">
                <p className="text-2xl mt-1 text-indigo-500 font-bold text-center">
                  {order?.product?.name}
                </p>
                <div className="flex justify-between">
                  <p>
                    <span className="font-medium">Quantity:</span>
                    {order?.quantity}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> ₹
                    {order?.product?.price}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <span className="font-medium">Rented on:</span>{" "}
                    {format(new Date(order?.createdAt), "dd-MM-yyyy HH:mm:ss")}
                  </p>
                  <p>
                    <span className="font-medium">Rented By:</span>{" "}
                    {order?.owner?.name}
                  </p>
                </div>
              </div>

              {/* Rent Period */}
              <p className="px-4">
                Rent Period:{" "}
                <span className="text-indigo-600 font-medium">
                  {format(new Date(order.from), "dd MMM yyyy")} ➜{" "}
                  {format(new Date(order.to), "dd MMM yyyy")}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="mt-1 flex gap-2">
                {isAfter(order?.to, new Date()) ? (
                  <>
                    {/* Future Order - Cancel + Receipt */}
                    <button
                      onClick={() => handleOpenConfirm(order._id)}
                      disabled={!!disabledButtons[order._id]}
                      className={`flex-1 px-4 py-2 rounded transition ${
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

                    <button
                      onClick={() => handleDownloadReceipt(order._id)}
                      className="flex-1 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      📄 Receipt
                    </button>
                  </>
                ) : reviewedOrders[order._id] ? (
                  <>
                    {/* Past Order + Reviewed */}
                    <button
                      disabled
                      className="flex-1 px-4 py-2 rounded bg-green-600 text-white cursor-not-allowed"
                    >
                      ✅ You Reviewed
                    </button>

                    <button
                      onClick={() => handleDownloadReceipt(order._id)}
                      className="flex-1 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      📄 Receipt
                    </button>
                  </>
                ) : (
                  <>
                    {/* Past Order + Not Reviewed */}
                    <button
                      onClick={() => {
                        setReviewOrderId(order._id);
                        setShowReviewForm(true);
                      }}
                      className="flex-1 px-4 py-2 rounded bg-sky-700 hover:bg-sky-900 text-white"
                    >
                      Leave A Review
                    </button>

                    <button
                      onClick={() => handleDownloadReceipt(order._id)}
                      className="flex-1 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      📄 Receipt
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        content="Are you sure you want to cancel this rental order?"
      />

      {/* Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

            <div className="flex flex-col items-center justify-center text-center">
              <label className="text-lg font-medium mb-2">Rating</label>
              <Rating
                name="review-rating"
                value={reviewRating}
                onChange={(event, newValue) => setReviewRating(newValue)}
                precision={1}
                style={{ fontSize: "40px" }}
              />
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Message:
            </label>
            <textarea
              rows="4"
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              className="w-full border px-3 py-2 mb-4 outline-0 rounded"
              placeholder="Write your review..."
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewMessage("");
                  setReviewRating(0);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveReview}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrder;
