import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import CategoryNavbar from "../CategoryNavbar"; // 👈 Make sure this is imported correctly

function GetAllProducts() {
  const { products, getAllProducts } = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getAllProducts();
  }, []);

  // Filtered products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categories.includes(selectedCategory))
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Category Filter Navigation */}
      <CategoryNavbar
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <h2 className="text-4xl font-bold text-center text-indigo-700 mt-4 mb-6">
        Explore Rental's
      </h2>

      {/*  Filtered Product List */}
      {filteredProducts?.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {filteredProducts?.map((product) => (
            <Link
              to={`/rental/${product._id}`}
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 truncate">
                  {product.description.slice(0, 60)}...
                </p>
                <div className="mt-2 text-indigo-600 font-bold text-lg">
                  ₹ {product.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetAllProducts;
