import { useState, useContext } from "react";
import ProductContext from "./ProductContext";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../Authentication/UserContext";
import { useNavigate } from "react-router-dom";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const navigate = useNavigate();

  const createProduct = async (product, image) => {
    const formData = new FormData();
    const { handleUnauthorized } = useContext(UserContext);

    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("categories", JSON.stringify(product.categories));
    formData.append("address", JSON.stringify(product.address));
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
        },
      );
      toast.success("New Product Is Added");
      return res.data.id;
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      console.error(err);
      toast.error("Product creation failed");
    }
  };

  const getAllProducts = async () => { //this is public page , user don't have to login on this page
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product`,
      );
      setProducts(res.data);
    } catch (err) {
      setProducts([]);
    }
  };

  const getProductById = async (id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        },
      );

      setSingleProduct(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          error?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      setSingleProduct(null);
    }
  };

  const updateProduct = async (id, product, image) => {
    const formData = new FormData();

    for (let key in product) {
      if (key === "categories" || key === "address") {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
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
        },
      );
      toast.success("Product updated successfully");
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      console.error(err);
      toast.error("Failed to update product");
      return false;
    }
  };

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
      if (error.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          error?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      toast.error("Failed to delete product");
      return false;
    }
  };

  const getMyProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/my-products`,
        {
          headers: {
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        },
      );
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      return [];
    }
  };
  const GetProductByCategoriesForOneProduct = async (id, categories) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/category-product`,
        { id, categories },
        {
          headers: {
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        },
      );
      setCategoryProduct(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized(navigate);
        toast.error(
          err?.response?.data?.message || "Unauthorized. Please login again.",
        );
      }
      setCategoryProduct([]);
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
        getMyProducts,
        GetProductByCategoriesForOneProduct,
        categoryProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductState;
