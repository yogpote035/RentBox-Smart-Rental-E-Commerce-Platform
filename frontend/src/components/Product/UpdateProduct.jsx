import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getProductById,
    singleProduct,
    updateProduct,
  } = useContext(ProductContext);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    getProductById(id);
  }, [id]);

  useEffect(() => {
    if (singleProduct) {
      setProduct({
        name: singleProduct.name || "",
        description: singleProduct.description || "",
        price: singleProduct.price || "",
      });
    }
  }, [singleProduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProduct(id, product, image);
    if (success) navigate(`/product/${id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md mt-8 rounded bg-white">
      <h2 className="text-xl font-bold text-center text-indigo-600 mb-4">
        Update Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
