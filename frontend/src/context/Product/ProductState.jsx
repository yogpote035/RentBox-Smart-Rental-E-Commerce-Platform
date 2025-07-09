import { useState } from "react";
import ProductContext from "./ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [categoryProduct, setCategoryProduct] = useState([]);

  const createProduct = async (product, image) => {
    const formData = new FormData();

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
        }
      );
      toast.success("New Product Is Added");
      return res.data.id;
    } catch (err) {
      console.error(err);
      toast.error("Product creation failed");
    }
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product`
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
        }
      );

      setSingleProduct(res.data);
    } catch (error) {
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
        }
      );
      toast.success("Product updated successfully");
      return true;
    } catch (err) {
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
        }
      );
      return res.data;
    } catch (err) {
      return [];
    }
  };
  const GetProductByCategoriesForOneProduct = async (id,categories) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/category-product`,
        { id,categories },
        {
          headers: {
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        }
      );
      setCategoryProduct(res.data);
    } catch (err) {
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
