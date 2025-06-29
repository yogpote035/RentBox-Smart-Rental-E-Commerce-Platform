import { useState } from "react";
import ProductContext from "./ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create a new product
  const createProduct = async (product, image) => {
    const formData = new FormData();
    for (let key in product) formData.append(key, product[key]);
    formData.append("image", image);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/create-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        }
      );
      toast.success("New Product Is Added");
      return res.data.id;
    } catch (err) {
      toast.error("Product creation failed");
      console.error(err.response?.data || err.message);
    }
  };

  // Fetch all products
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get one product by ID
  const getProductById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/${id}`);
      setSingleProduct(res.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, product, image) => {
    const formData = new FormData();
    for (let key in product) {
      formData.append(key, product[key]);
    }
    if (image) formData.append("image", image);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        }
      );
      toast.success("Product updated successfully");
      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update product");
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/product/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
          userId: localStorage.getItem("userId"),
        },
      });
      toast.success("Product deleted successfully");
      setSingleProduct(null);
      return true;
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
      return false;
    }
  };

  
  return (
    <ProductContext.Provider
      value={{
        products,
        getAllProducts,
        singleProduct,
        getProductById,
        updateProduct,
        createProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductState;
