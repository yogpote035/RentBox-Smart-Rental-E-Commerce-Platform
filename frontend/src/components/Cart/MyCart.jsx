import { useContext, useEffect, useState } from "react";
import CartContext from "../../context/cart/CartContext";
import { Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";
import ConfirmDialog from "../ConfirmDialog";

function MyCart() {
  const { cartItems, fetchCart, removeFromCart } = useContext(CartContext);
  const [removingItems, setRemovingItems] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleOpenDialog = (productId) => {
    setSelectedProductId(productId);
    setIsDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    const productId = selectedProductId;
    setRemovingItems((prev) => ({ ...prev, [productId]: true }));
    setIsDialogOpen(false);
    await removeFromCart(productId);
    await fetchCart();
    setRemovingItems((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold mb-10 text-indigo-700 text-center">
        My Favorites ❤️
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <FaHeartBroken size={50} className="mx-auto mb-4 text-rose-400" />
          <p className="text-lg">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map(({ product, quantity }) => {
            if (!product || !product._id) return null;

            return (
              <div
                key={`fav-${product._id}`}
                className="bg-white shadow-md border border-gray-200 rounded-lg p-4 transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.image || "/fallback.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-indigo-600 font-medium text-lg mt-1">
                      ₹{product.price}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {quantity}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => handleOpenDialog(product._id)}
                  disabled={removingItems[product._id]}
                  className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition-all ${
                    removingItems[product._id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {removingItems[product._id]
                    ? "Removing..."
                    : "Remove Product"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Product"
        content="Are you sure you want to remove this product from your favorites?"
      />
    </div>
  );
}

export default MyCart;
