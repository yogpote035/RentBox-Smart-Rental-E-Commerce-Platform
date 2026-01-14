import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import CategoryNavbar from "../CategoryNavbar";
import { 
  ShoppingBag, 
  IndianRupee, 
  Calendar,
  Sparkles,
  Filter,
  Package
} from "lucide-react";

function GetAllProducts() {
  const { products, getAllProducts } = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getAllProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categories.includes(selectedCategory))
    : products;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 text-gray-900 p-4 sm:p-6 md:p-8 mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <ShoppingBag size={28} className="text-white sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Explore Rentals
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles size={16} className="text-indigo-500" />
            <p className="text-gray-600 text-base sm:text-lg">Find the perfect gear for your adventure</p>
            <Sparkles size={16} className="text-indigo-500" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Filter size={20} className="text-indigo-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filter by Category</h3>
            </div>
            <CategoryNavbar
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>

        {/* Results Info */}
        {filteredProducts?.length > 0 && (
          <div className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <Package size={18} />
            <span>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              {selectedCategory && ` in "${selectedCategory}"`}
            </span>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts?.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center shadow-md">
            <Package size={64} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-gray-700 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm">
              {selectedCategory 
                ? `No items available in "${selectedCategory}" category. Try a different filter.`
                : "Check back later for new items."}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts?.map((product) => (
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
                        Rent Now
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GetAllProducts;