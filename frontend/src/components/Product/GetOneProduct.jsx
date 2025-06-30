import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import CartContext from "../../context/cart/CartContext";
import OrderContext from "../../context/orders/OrderContext";
import { toast } from "react-toastify";

function GetOneProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, singleProduct, deleteProduct } =
    useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { RentNow } = useContext(OrderContext);

  const [gifOne, setGifOne] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isRenting, setIsRenting] = useState(false);
  const [isAddingToFavorite, setIsAddingToFavorite] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    getProductById(id);
    const timer = setTimeout(() => setGifOne(false), 6100);
    return () => clearTimeout(timer);
  }, [id]);

  const handleRentNow = async () => {
    if (!localStorage.getItem("token")) {
      return navigate("/login");
    }
    if (quantity < 1) return toast.warning("Minimum quantity is 1");

    setIsRenting(true);
    await RentNow(singleProduct._id, quantity);

    // Disable for 3 seconds
    setTimeout(() => setIsRenting(false), 3000);
  };

  const handleAddToFavorite = async () => {
    if (!localStorage.getItem("token")) {
      return navigate("/login");
    }
    if (quantity < 1) return toast.warning("Minimum quantity is 1");

    setIsAddingToFavorite(true);
    await addToCart(singleProduct._id, quantity);

    // Disable for 3 seconds
    setTimeout(() => setIsAddingToFavorite(false), 3000);
  };

  const handleDelete = async () => {
    setIsDisable(true);
    const res = await deleteProduct(singleProduct._id);

    // Disable for 3 seconds
    setTimeout(() => setIsAddingToFavorite(false), 2000);

    if (res) {
      navigate("/my-products");
    }
  };

  const isOwner = singleProduct?.owner?._id === localStorage.getItem("userId");

  if (!singleProduct) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black w-screen h-screen overflow-hidden">
        {gifOne ? (
          <video
            src="/utils/newLoading.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src="/utils/404.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={singleProduct.image || "/fallback.jpg"}
          alt={singleProduct.name}
          className="w-full h-96 object-cover rounded-l-xl"
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-indigo-700 mb-4">
              {singleProduct.name}
            </h1>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {singleProduct.description}
            </p>
            <div className="text-xl text-indigo-600 font-semibold mb-4">
              ₹ {singleProduct.price}
            </div>
            <div className="text-sm text-gray-400">
              Product ID: {singleProduct._id}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            {!isOwner && (
              <>
                <button
                  onClick={handleRentNow}
                  disabled={isRenting}
                  className={`px-6 py-2 rounded transition text-white ${
                    isRenting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isRenting ? "Processing..." : "Rent Now"}
                </button>

                <button
                  onClick={handleAddToFavorite}
                  disabled={isAddingToFavorite}
                  className={`px-6 py-2 rounded transition text-white ${
                    isAddingToFavorite
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isAddingToFavorite ? "Adding..." : "Add To Favorite"}
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  className="w-20 border rounded px-2 py-1 outline-none"
                />
              </>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/update-product/${id}`)}
                  className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Update Product
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                  disabled={isDisable}
                >
                  Delete Product
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetOneProduct;
