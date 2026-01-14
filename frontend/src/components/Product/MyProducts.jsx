import React, { useContext, useEffect, useState } from "react";
import ProductContext from "../../context/Product/ProductContext";
import { Link } from "react-router-dom";
import {
  Package,
  IndianRupee,
  Calendar,
  Sparkles,
  ShoppingBag,
  Plus,
  Loader2,
} from "lucide-react";

function MyProducts() {
  const { getMyProducts } = useContext(ProductContext);
  const [myProducts, setMyProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getMyProducts();
      setMyProducts(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <ShoppingBag size={28} className="text-white sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Rentals
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles size={16} className="text-indigo-500" />
            <p className="text-gray-600 text-base sm:text-lg">
              Products you've listed for rent
            </p>
            <Sparkles size={16} className="text-indigo-500" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your products...</p>
          </div>
        ) : myProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-md">
            <Package size={64} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-gray-700 text-lg mb-2 font-semibold">
              No products yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              You haven't added any products for rent yet. Start listing your items!
            </p>
            <Link
              to="/create-rental"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Your First Product
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <>
            {/* Product Count */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Package size={18} />
                <span className="text-sm sm:text-base">
                  {myProducts.length} {myProducts.length === 1 ? "Product" : "Products"} Listed
                </span>
              </div>
              <Link
                to="/create-rental"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                <Plus size={16} />
                Add New Product
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {myProducts.map((product) => (
                <Link
                  to={`/rental/${product._id}`}
                  key={product._id}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 hover:border-indigo-400 hover:border-2 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badge */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-indigo-600/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                        <Calendar size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                        <span className="text-xs font-semibold text-white">Per Day</span>
                      </div>

                      {/* Owner Badge */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-600/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-white">Your Listing</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          <IndianRupee size={18} className="text-indigo-600 sm:w-5 sm:h-5" strokeWidth={2.5} />
                          <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                            {product.price}
                          </span>
                          <span className="text-gray-500 text-xs sm:text-sm">/day</span>
                        </div>
                        
                        <div className="bg-indigo-100 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all">
                          Manage
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyProducts;