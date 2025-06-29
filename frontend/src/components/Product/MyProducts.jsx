import React, { useContext, useEffect, useState } from "react";
import ProductContext from "../../context/Product/ProductContext";
import { Link } from "react-router-dom";

function MyProducts() {
  const { getMyProducts } = useContext(ProductContext);
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getMyProducts();
      setMyProducts(data);
    };
    fetch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Products You've Added
      </h2>

      {myProducts.length === 0 ? (
        <p className="text-center text-gray-500">You haven't added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
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

export default MyProducts;
