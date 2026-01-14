import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import CartContext from "../../context/cart/CartContext";
import OrderContext from "../../context/orders/OrderContext";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import ConfirmDialog from "../ConfirmDialog";
import {
  Calendar,
  User,
  Star,
  MessageCircle,
  Heart,
  ShoppingCart,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function GetOneProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProductById,
    singleProduct,
    deleteProduct,
    GetProductByCategoriesForOneProduct,
    categoryProduct,
  } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const {
    RentNow,
    fetchMyOrders,
    isAvailable,
    setIsAvailable,
    availabilityMessage,
    CheckAvailability,
    fetchReviews,
    reviews,
    checkReviewedByUser,
    setAvailabilityMessage,
  } = useContext(OrderContext);

  const [hasOrdered, setHasOrdered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToFavorite, setIsAddingToFavorite] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [showFakePayment, setShowFakePayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    getProductById(id);
    fetchMyOrders();
    fetchReviews(id);
  }, [id]);

  useEffect(() => {
    if (singleProduct?.orders) {
      setOrders(singleProduct.orders);
    }
  }, [singleProduct]);

  useEffect(() => {
    if (orders.length > 0) {
      checkReviewedByUser();
    }
  }, [orders]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleProduct]);

  useEffect(() => {
    if (singleProduct?.categories.length > 0) {
      GetProductByCategoriesForOneProduct(id, singleProduct?.categories);
    }
  }, [singleProduct]);

  useEffect(() => {
    const fetchRating = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/average-rating/${id}`
      );
      const data = await res.json();
      setAverageRating(Math.floor(data.averageRating));
      setTotalReviews(data.totalReviews);
      setAvailabilityMessage("");
    };
    fetchRating();
  }, [id]);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (singleProduct?.orders?.length > 0 && currentUserId) {
      const orderedByUser = singleProduct.orders.some(
        (order) => order.owner?._id === currentUserId
      );
      setHasOrdered(orderedByUser);
    } else {
      setHasOrdered(false);
    }
  }, [singleProduct, currentUserId]);

  const handleCheckAvailability = async () => {
    await CheckAvailability(singleProduct._id, from, to);
  };

  const handleRentNow = async () => {
    if (!isAvailable || !from || !to) {
      toast.warning("Check availability first");
      return;
    }
    setIsAvailable(false);
    setIsRenting(true);
    setOpenDialog(false);

    const res = await RentNow(
      id,
      quantity,
      format(from, "yyyy-MM-dd"),
      format(to, "yyyy-MM-dd")
    );
    localStorage.setItem("redirect-url", `/rental/${id}`);
    if (res === "add-address") {
      return navigate("/add-address");
    }
    setShowFakePayment(true);
    setAvailabilityMessage("");

    setTimeout(async () => {
      setShowFakePayment(false);
      if (res) {
        setShowPaymentSuccess(true);
        toast.success("Rent confirmed 🤝");
        await fetchMyOrders();
        await getProductById(id);
        setTimeout(() => {
          setShowPaymentSuccess(false);
        }, 3000);
      } else {
        toast.error("Rent failed 😢");
      }
      setIsRenting(false);
    }, 4000);
  };

  const handleDelete = async () => {
    setIsDisable(true);
    const res = await deleteProduct(id);
    if (res) navigate("/my-rentals");
  };

  const isOwner = singleProduct?.owner?._id === localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Product Section */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 sm:h-96 lg:h-auto bg-gray-100">
            <img
              src={singleProduct?.image || "/utils/fallback.png"}
              alt={singleProduct?.name}
              className="w-full h-full object-cover"
            />
            {totalReviews > 0 && (
              <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                {averageRating}
                <Star size={14} className="fill-yellow-300 text-yellow-300" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {singleProduct?.name}
              </h1>

              {totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
                  </span>
                </div>
              )}

              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                {singleProduct?.description}
              </p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                <div className="text-2xl sm:text-3xl text-indigo-600 font-bold flex items-center gap-2">
                  ₹{singleProduct?.price}
                  <span className="text-base font-normal text-gray-600">/per day</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-indigo-600" />
                  <span className="font-medium">Product ID:</span>
                  <span className="font-mono text-xs">{singleProduct?._id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  <span className="font-medium">Owner:</span>
                  <span>{singleProduct?.owner?.name}</span>
                </div>
              </div>

              {/* Booking Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={18} className="text-indigo-600" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Booking Status
                  </h3>
                </div>
                {orders.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Available - No bookings yet</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm text-red-700 font-medium">
                            {format(new Date(order.from), "dd MMM yyyy")} →{" "}
                            {format(new Date(order.to), "dd MMM yyyy")}
                          </span>
                          {isOwner && order?.owner?._id && (
                            <button
                              onClick={() =>
                                navigate("/chat", {
                                  state: {
                                    currentUserId: localStorage.getItem("userId"),
                                    chatWithUserId: order.owner._id,
                                    chatWithUserName: order.owner?.name,
                                    currentUserRole: "owner",
                                  },
                                })
                              }
                              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                            >
                              <MessageCircle size={14} />
                              Chat with Renter
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!isOwner && (
                      <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p className="text-xs">
                          Check next available date for rent (Click on Rent Now)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Categories */}
              {singleProduct?.categories?.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {singleProduct.categories.map((category) => (
                      <span
                        key={category}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium border border-indigo-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isOwner ? (
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => setOpenDialog(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={18} />
                  Rent Now
                </button>
                <button
                  onClick={() => {
                    setIsAddingToFavorite(true);
                    addToCart(singleProduct._id, quantity);
                    setTimeout(() => {
                      setIsAddingToFavorite(false);
                    }, 3000);
                  }}
                  disabled={isAddingToFavorite}
                  className={`flex items-center gap-2 ${
                    isAddingToFavorite
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-6 py-3 rounded-xl transition font-semibold shadow-lg`}
                >
                  <Heart size={18} />
                  {isAddingToFavorite ? "Added!" : "Add To Favorite"}
                </button>
                {hasOrdered && (
                  <button
                    onClick={() =>
                      navigate("/chat", {
                        state: {
                          currentUserId: currentUserId,
                          chatWithUserId: singleProduct?.owner?._id,
                          chatWithUserName: singleProduct?.owner?.name,
                          currentUserRole: "renter",
                        },
                      })
                    }
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
                  >
                    <MessageCircle size={18} />
                    Chat with Owner
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => navigate(`/update-rental/${id}`)}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition font-semibold"
                >
                  <Edit size={18} />
                  Update Rental
                </button>
                <Button
                  onClick={() => setIsConfirmDialogOpen(true)}
                  className="!flex !items-center !gap-2 !bg-red-600 !text-white !px-6 !py-3 !rounded-xl hover:!bg-red-700 !transition !font-semibold !normal-case"
                  disabled={isDisable}
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Star size={24} className="text-indigo-600 fill-indigo-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Customer Reviews
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-xl hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.owner?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <p className="font-semibold text-gray-900">
                        {review.owner?.name || "User"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 mb-3 leading-relaxed">
                    {review.message}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <Calendar size={14} />
                    <span>
                      Rent Period: {format(new Date(review?.order?.from), "dd MMM yyyy")}{" "}
                      → {format(new Date(review?.order?.to), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Products */}
        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Other Rentals in This Category
          </h2>

          {categoryProduct?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No similar products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProduct?.map((product) => (
                <Link
                  to={`/rental/${product._id}`}
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-56 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-xl font-bold text-indigo-600">
                        ₹{product.price}
                        <span className="text-xs font-normal text-gray-500">/day</span>
                      </div>
                      <div className="bg-indigo-100 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-all">
                        View
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Choose Rent Period</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2 overflow-auto">
          <DatePicker
            label="From Date"
            value={from}
            onChange={(newValue) => {
              setFrom(newValue);
              setIsAvailable(false);
            }}
            format="dd/MM/yyyy"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="To Date"
            value={to}
            onChange={(newValue) => {
              setTo(newValue);
              setIsAvailable(false);
            }}
            format="dd/MM/yyyy"
            slotProps={{ textField: { fullWidth: true } }}
          />
          {availabilityMessage && (
            <Typography
              variant="body2"
              color={isAvailable ? "green" : "error"}
              className="pl-1 pt-1"
            >
              {availabilityMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setAvailabilityMessage("");
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleCheckAvailability}>Check Availability</Button>
          <Button
            onClick={handleRentNow}
            variant="contained"
            disabled={!isAvailable || isRenting}
            color="primary"
          >
            Confirm Rent
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={async () => {
          setIsConfirmDialogOpen(false);
          await handleDelete();
        }}
        title="Confirm Deletion"
        content="Are you sure you want to delete this product? This action cannot be undone."
      />

      <Dialog open={showFakePayment} onClose={() => {}}>
        <DialogTitle className="text-green-600 text-center">
          🔐 Processing Payment
        </DialogTitle>
        <DialogContent className="text-center p-6">
          <p className="text-xl text-center font-medium mb-2">
            Connecting to FunnyPay™ Gateway...
          </p>
          <p className="text-sm text-center text-gray-500">
            Simulating secure transaction 🔒
          </p>
          <img
            src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
            alt="Processing"
            className="w-24 h-24 mx-auto mt-4"
          />
          <p className="mt-4 text-green-700 text-center font-bold">
            Please wait...
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentSuccess} onClose={() => {}} hideBackdrop>
        <DialogTitle className="text-green-700 text-center">
          🎉 Payment Successful
        </DialogTitle>
        <DialogContent className="text-center p-6">
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTd2OWE0MjNzcGc2cTcyMDg5ZTJ6bWlta2JxdHBoMnZia3NyY2ZpdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PijzuUzUhm7hcWinGn/giphy.gif"
            alt="Success"
            className="w-60 h-60 mx-auto rounded-md mb-4"
          />
          <p className="text-xl font-semibold text-indigo-700">
            Transaction Complete!
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Your rent is confirmed. You'll receive your product soon! 🛒
          </p>
          <p className="text-sm text-yellow-500 mt-1">
            See Your Order in Orders Section
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GetOneProduct;