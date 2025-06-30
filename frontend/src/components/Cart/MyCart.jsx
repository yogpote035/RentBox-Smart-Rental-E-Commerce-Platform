import { useContext, useEffect, useState } from "react";
import CartContext from "../../context/cart/CartContext";
import { Link } from "react-router-dom";

function MyCart() {
  const { cartItems, fetchCart, removeFromCart } = useContext(CartContext);
  const [removingItems, setRemovingItems] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    setRemovingItems((prev) => ({ ...prev, [productId]: true }));
    await removeFromCart(productId);

    setTimeout(() => {
      setRemovingItems((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">My Favorites</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Nothing in Your Wishlist.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map(({ product, quantity }) => {
            // ✅ Guard against null or incomplete product
            if (!product || !product._id) return null;

            return (
              <div
                key={`fav-${product._id}`}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-200 shadow-sm p-4 rounded-lg bg-white hover:shadow-md transition"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="flex items-center gap-4 w-full sm:w-auto"
                >
                  <img
                    src={product.image || "/fallback.jpg"}
                    alt={product.name}
                    className="w-28 h-28 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">₹{product.price}</p>
                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={removingItems[product._id]}
                  className={`px-5 py-2 rounded transition text-white ${
                    removingItems[product._id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {removingItems[product._id] ? "Removing..." : "Remove Product"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyCart;
