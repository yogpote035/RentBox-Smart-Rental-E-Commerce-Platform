import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function SearchProduct() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/product/search?query=${query}`
        )
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Search error", err));
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        Search Results for <span className="text-rose-600">"{query}"</span>
      </h2>

      {results.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.map((product) => (
            <Link
              to={`/rental/${product._id}`}
              key={product._id}
              className="bg-white shadow-lg hover:shadow-2xl border border-gray-200 hover:border-indigo-500 transition-all duration-300 rounded-xl overflow-hidden group"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={product.image || "/utils/fallback.png"}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col justify-between h-38">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description?.slice(0, 100)}...
                  </p>
                </div>

                <div className="flex justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 text-lg font-bold">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-">
                    <span className="flex items-center gap-1">
                      <FaUserCircle className="text-lg" />
                      {product.owner?.name || "Anonymous"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchProduct;
