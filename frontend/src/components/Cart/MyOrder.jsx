import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import OrderContext from "../../context/orders/OrderContext";
import { toast } from "react-toastify";
import { format, isAfter } from "date-fns";
import ConfirmDialog from "../ConfirmDialog";
import Rating from "@mui/material/Rating";
import {
  ShoppingBag,
  Calendar,
  IndianRupee,
  User,
  Package,
  X,
  FileText,
  Star,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await fetchMyOrders();
      setIsLoading(false);
    };
    loadOrders();
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Rental Orders
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles size={16} className="text-indigo-500" />
            <p className="text-gray-600 text-base sm:text-lg">
              Track and manage your rentals
            </p>
            <Sparkles size={16} className="text-indigo-500" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-md">
            <Package size={64} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-gray-700 text-lg mb-2 font-semibold">
              No orders yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              You haven't rented any products yet. Start browsing!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <ShoppingBag size={20} />
              Browse Products
            </Link>
          </div>
        ) : (
          /* Orders Grid */
          <>
            {/* Order Count */}
            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <Package size={18} />
              <span className="text-sm sm:text-base">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map((order) => {
                const isPastOrder = !isAfter(order?.to, new Date());
                const isReviewed = reviewedOrders[order._id];

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    {/* Product Image */}
                    <Link to={`/rental/${order.product?._id}`} className="block group">
                      <div className="relative overflow-hidden h-48 bg-gray-100">
                        <img
                          src={order.product?.image || "/utils/fallback.png"}
                          alt={order.product?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Status Badge */}
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm ${
                          isPastOrder 
                            ? "bg-gray-600/90" 
                            : "bg-green-600/90"
                        }`}>
                          <Calendar size={12} className="text-white" />
                          <span className="text-xs font-semibold text-white">
                            {isPastOrder ? "Completed" : "Active"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Order Details */}
                    <div className="p-5 space-y-3">
                      <Link to={`/rental/${order.product?._id}`}>
                        <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                          {order?.product?.name}
                        </h3>
                      </Link>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Package size={14} className="text-indigo-600" />
                          <span>Qty: {order?.quantity}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <IndianRupee size={14} className="text-indigo-600" />
                          <span>{order?.product?.price}/day</span>
                        </div>
                      </div>

                      {/* Rental Period */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-indigo-600" />
                          <span className="text-xs font-semibold text-indigo-700">Rental Period</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {format(new Date(order.from), "dd MMM yyyy")} → {format(new Date(order.to), "dd MMM yyyy")}
                        </p>
                      </div>

                      {/* Additional Info */}
                      <div className="pt-2 border-t border-gray-200 space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-indigo-600" />
                          <span>Rented by: {order?.owner?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-indigo-600" />
                          <span>Ordered: {format(new Date(order?.createdAt), "dd MMM yyyy, HH:mm")}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {!isPastOrder ? (
                          // Active Order - Cancel + Receipt
                          <>
                            <button
                              onClick={() => handleOpenConfirm(order._id)}
                              disabled={!!disabledButtons[order._id]}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                                disabledButtons[order._id]
                                  ? "bg-gray-400 cursor-not-allowed text-white"
                                  : "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
                              }`}
                            >
                              {disabledButtons[order._id] ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <XCircle size={16} />
                                  Cancel
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(order._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                            >
                              <FileText size={16} />
                              Receipt
                            </button>
                          </>
                        ) : isReviewed ? (
                          // Past Order + Reviewed
                          <>
                            <button
                              disabled
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white cursor-not-allowed font-medium"
                            >
                              <CheckCircle size={16} />
                              Reviewed
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(order._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                            >
                              <FileText size={16} />
                              Receipt
                            </button>
                          </>
                        ) : (
                          // Past Order + Not Reviewed
                          <>
                            <button
                              onClick={() => {
                                setReviewOrderId(order._id);
                                setShowReviewForm(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-all shadow-md hover:shadow-lg"
                            >
                              <Star size={16} />
                              Review
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(order._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                            >
                              <FileText size={16} />
                              Receipt
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        content="Are you sure you want to cancel this rental order? This action cannot be undone."
      />

      {/* Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setShowReviewForm(false);
                setReviewMessage("");
                setReviewRating(0);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Star size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Write a Review</h3>
                <p className="text-sm text-gray-600">Share your rental experience</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center justify-center bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <Rating
                    name="review-rating"
                    value={reviewRating}
                    onChange={(event, newValue) => setReviewRating(newValue)}
                    precision={1}
                    size="large"
                    sx={{
                      fontSize: "3rem",
                      "& .MuiRating-iconFilled": {
                        color: "#6366f1",
                      },
                      "& .MuiRating-iconHover": {
                        color: "#4f46e5",
                      },
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare size={16} className="text-indigo-600" />
                  Your Review
                </label>
                <textarea
                  rows="4"
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                  placeholder="Share your experience with this rental..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewMessage("");
                    setReviewRating(0);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveReview}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrder;