import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function GetOneProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, singleProduct, deleteProduct } =
    useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const {
    RentNow,
    fetchMyOrders,
    isAvailable,
    availabilityMessage,
    CheckAvailability,
    fetchReviews,
    reviews,
    setAvailabilityMessage,
  } = useContext(OrderContext);

  const [quantity, setQuantity] = useState(1);
  const [isAddingToFavorite, setIsAddingToFavorite] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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

  // for option only when user ordered product
  const [hasOrdered, setHasOrdered] = useState(false);
  const currentUserId = localStorage.getItem("userId");
  const [, forceRender] = useState(0);

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

    const res = await RentNow(
      id,
      quantity,
      format(from, "yyyy-MM-dd"),
      format(to, "yyyy-MM-dd")
    );
    if (res) {
      toast.success("Rent confirmed");
      setOpenDialog(false);
      await fetchMyOrders();
      await getProductById(id);
    } else {
      toast.error("Rent failed");
    }
  };

  const handleDelete = async () => {
    setIsDisable(true);
    const res = await deleteProduct(id);
    setTimeout(() => setIsAddingToFavorite(false), 2000);
    if (res) navigate("/my-products");
  };

  const isOwner = singleProduct?.owner?._id === localStorage.getItem("userId");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={singleProduct?.image || "/utils/fallback.png"}
          alt={singleProduct?.name}
          className="w-full h-96 object-cover rounded-l-xl"
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-indigo-700 mb-4">
              {singleProduct?.name}
            </h1>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {singleProduct?.description}
            </p>
            <div className="text-xl text-indigo-600 font-semibold mb-4">
              ₹ {singleProduct?.price}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Product ID: {singleProduct?._id}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Owner: {singleProduct?.owner?.name}
            </div>

            {/* Booked dates */}
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-sky-600">
                Booking Status:
              </h3>
              {orders.length === 0 ? (
                <span className="text-green-600">No bookings yet</span>
              ) : (
                <ul className="text-sm text-gray-700">
                  {orders.map((order) => (
                    <li
                      key={order._id}
                      className="flex items-center justify-between text-red-600"
                    >
                      <span>
                        {format(new Date(order.from), "dd MMM yyyy")} ➜{" "}
                        {format(new Date(order.to), "dd MMM yyyy")}
                      </span>

                      {/* Only show Chat With Renter button for owner */}
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
                          className="bg-indigo-600 text-white px-6 py-2 my-1 rounded hover:bg-indigo-700 transition"
                        >
                          Chat with Renter
                        </button>
                      )}
                    </li>
                  ))}

                  {!isOwner && (
                    <p className="text-sm text-red-700">
                      * Check Next Date For Rent (Click on Rent Now)
                    </p>
                  )}
                </ul>
              )}
            </div>
            {singleProduct?.categories?.length !== 0 && (
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                {singleProduct?.categories?.map((categories) => (
                  <button
                    key={categories}
                    disabled={true}
                    className="bg-gray-200 text-indigo-400 px-6 py-2 rounded hover:text-rose-500 transition"
                  >
                    {categories}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isOwner && (
            <>
              <label htmlFor="quantity" className="text-sm mt-3 text-sky-600">
                Select Quantity
              </label>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    id="quantity"
                    className="w-20 border rounded px-2 py-1 outline-none"
                  />
                </div>
                <button
                  onClick={() => setOpenDialog(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Rent Now
                </button>

                <button
                  onClick={() => addToCart(singleProduct._id, quantity)}
                  disabled={isAddingToFavorite}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Add To Favorite
                </button>
                {!isOwner && hasOrdered && (
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
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Chat with Owner
                  </button>
                )}
              </div>
            </>
          )}

          {isOwner && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => navigate(`/update-product/${id}`)}
                className="bg-yellow-500 text-white px-6 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
              >
                Update Rentals
              </button>
              <Button
                onClick={() => setIsConfirmDialogOpen(true)}
                className="!bg-red-600 font-serif !text-white px-6 py-2 rounded hover:!bg-red-700 !transition"
                disabled={isDisable}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-100 p-4 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-700">
                    {review.owner?.name || "User"}
                  </p>
                  <div className="text-yellow-500 text-sm">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-800">{review.message}</p>
                <p className="text-blue-800">
                  Rent Period: &nbsp;
                  {format(new Date(review?.order?.from), "dd,MMM,yyyy")}&nbsp; ➜
                  &nbsp;
                  {format(new Date(review?.order?.to), "dd,MMM,yyyy")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rent dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Choose Rent Period</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2 overflow-auto">
          <DatePicker
            label="From Date"
            value={from}
            onChange={(newValue) => setFrom(newValue)}
            format="dd/MM/yyyy"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="To Date"
            value={to}
            onChange={(newValue) => setTo(newValue)}
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
              setOpenDialog(false), setAvailabilityMessage("");
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleCheckAvailability}>Check Availability</Button>
          <Button
            onClick={handleRentNow}
            variant="contained"
            disabled={!isAvailable}
            color="primary"
          >
            Confirm Rent
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete dialog */}
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
    </div>
  );
}

export default GetOneProduct;
