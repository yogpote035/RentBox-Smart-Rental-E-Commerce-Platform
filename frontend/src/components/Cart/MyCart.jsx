import { useContext, useEffect } from "react";
import CartContext from "../../context/cart/CartContext";
import { Link } from "react-router-dom";

function MyCart() {
  const { cartItems, fetchCart, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">My Favorite </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Nothing in Your Wishlist.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map(({ product, quantity }) => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <div
                key={product._id}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-200 shadow-sm p-4 rounded-lg bg-white hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
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
                </div>

                <button
                  onClick={() => removeFromCart(product._id)}
                  className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCart;
