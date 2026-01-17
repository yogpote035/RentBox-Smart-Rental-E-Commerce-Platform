import { useContext, useEffect, useState } from "react";
import CartContext from "../../context/cart/CartContext";
import { Link } from "react-router-dom";
import ConfirmDialog from "../ConfirmDialog";
import {
  Heart,
  HeartCrack,
  IndianRupee,
  Trash2,
  ShoppingBag,
  Sparkles,
  Package,
  Loader2,
} from "lucide-react";

function MyCart() {
  const { cartItems, fetchCart, removeFromCart } = useContext(CartContext);
  const [removingItems, setRemovingItems] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      await fetchCart();
      setIsLoading(false);
    };
    loadCart();
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
         
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              My Favorites
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles size={16} className="text-red-500" />
            <p className="text-gray-600 text-base sm:text-lg">
              Products you've saved for later
            </p>
            <Sparkles size={16} className="text-red-500" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-md">
            <HeartCrack size={64} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-gray-700 text-lg mb-2 font-semibold">
              No favorites yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Start adding products to your favorites to see them here!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <ShoppingBag size={20} />
              Browse Products
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <>
            {/* Count Display */}
            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <span className="text-sm sm:text-base">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in favorites
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {cartItems.map(({ product, quantity }) => {
                if (!product || !product._id) return null;

                return (
                  <div
                    key={`fav-${product._id}`}
                    className="bg-white border border-gray-200 hover:border-red-400 hover:border-2 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <Link to={`/rental/${product._id}`} className="block group">
                      {/* Image */}
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-100">
                        <img
                          src={product.image || "/utils/fallback.png"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Favorite Badge */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-600/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                          <Heart size={12} className="text-white fill-white sm:w-3.5 sm:h-3.5" />
                          <span className="text-xs font-semibold text-white">Favorite</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <IndianRupee size={18} className="text-indigo-600 sm:w-5 sm:h-5" strokeWidth={2.5} />
                            <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                              {product.price}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">/day</span>
                          </div>
                        </div>

                        {quantity > 1 && (
                          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                            <Package size={14} />
                            <span>Quantity: {quantity}</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                      <button
                        onClick={() => handleOpenDialog(product._id)}
                        disabled={removingItems[product._id]}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-semibold transition-all shadow-md ${
                          removingItems[product._id]
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
                        }`}
                      >
                        {removingItems[product._id] ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 size={18} />
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove from Favorites"
        content="Are you sure you want to remove this product from your favorites? You can always add it back later."
      />
    </div>
  );
}

export default MyCart;