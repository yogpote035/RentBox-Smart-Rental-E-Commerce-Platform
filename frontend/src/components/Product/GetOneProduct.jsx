import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";

function GetOneProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, singleProduct, deleteProduct } = useContext(ProductContext);
  const [gifOne, setGifOne] = useState(true);

  useEffect(() => {
    getProductById(id);
    const timer = setTimeout(() => setGifOne(false), 6100);
    return () => clearTimeout(timer);
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const success = await deleteProduct(id);
    if (success) navigate("/");
  };

  const isOwner = singleProduct?.owner?._id === localStorage.getItem("userId");

  if (!singleProduct) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black w-screen h-screen overflow-hidden">
        {gifOne ? (
          <video src="/utils/newLoading.mp4" autoPlay loop muted className="w-full h-full object-cover" />
        ) : (
          <video src="/utils/404.mp4" autoPlay loop muted className="w-full h-full object-cover" />
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

          <div className="mt-6 flex flex-wrap gap-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
              Rent Now
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded hover:bg-indigo-100 transition">
              Wishlist
            </button>

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
