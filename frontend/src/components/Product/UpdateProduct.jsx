import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductContext from "../../context/Product/ProductContext";
import {
  FaBolt, FaBicycle, FaCar, FaCouch, FaBook, FaTools,
  FaTshirt, FaMobileAlt, FaFootballBall, FaQuestionCircle, FaHouseDamage
} from "react-icons/fa";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, singleProduct, updateProduct } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    priceUnit: "",
    categories: [],
    address: {
      buildingName: "",
      laneNo: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phone: "",
    },
  });

  const [image, setImage] = useState(null);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    getProductById(id);
  }, [id]);

  useEffect(() => {
    if (singleProduct) {
      const [priceValue, priceUnitValue] = (singleProduct.price || "").split("/");

      setFormData({
        name: singleProduct.name || "",
        description: singleProduct.description || "",
        price: priceValue || "",
        priceUnit: priceUnitValue || "",
        categories: singleProduct.categories || [],
        address: singleProduct.address?.[0] || {
          buildingName: "",
          laneNo: "",
          landmark: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          phone: "",
        },
      });
    }
  }, [singleProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["buildingName", "laneNo", "landmark", "city", "state", "country", "pincode", "phone"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleToggleCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisable(true);
    const finalFormData = {
      ...formData,
      price: `${formData.price}/${formData.priceUnit}`, 
    };
    const success = await updateProduct(id, finalFormData, image);
    setTimeout(() => setIsDisable(false), 2000);
    if (success) navigate(`/product/${id}`);
  };

  const categoryOptions = [
    { name: "electric", icon: <FaBolt /> },
    { name: "bike", icon: <FaBicycle /> },
    { name: "vehicle", icon: <FaCar /> },
    { name: "furniture", icon: <FaCouch /> },
    { name: "books", icon: <FaBook /> },
    { name: "tools", icon: <FaTools /> },
    { name: "clothing", icon: <FaTshirt /> },
    { name: "gadgets", icon: <FaMobileAlt /> },
    { name: "sports", icon: <FaFootballBall /> },
    { name: "property", icon: <FaHouseDamage /> },
    { name: "other", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Update Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full p-3 border rounded" />

        <select
          name="priceUnit"
          value={formData.priceUnit}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-4"
          required
        >
          <option value="" disabled>Select Price Unit</option>
          <option value="per hour">Per Hour</option>
          <option value="per day">Per Day</option>
          <option value="per week">Per Week</option>
          <option value="per month">Per Month</option>
          <option value="per year">Per Year</option>
        </select>

        <h3 className="text-lg font-semibold text-gray-800">🏷️ Select Categories</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryOptions.map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleToggleCategory(name)}
              className={`flex items-center gap-2 px-4 py-1 rounded-full border text-sm font-medium transition-all duration-200 ${
                formData.categories.includes(name)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {icon}
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 border rounded" />

        <hr className="my-4" />
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">📍 Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {["buildingName", "laneNo", "landmark", "city", "state", "country", "pincode", "phone"].map((field) => (
            <input
              key={field}
              type={field === "pincode" || field === "phone" ? "number" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData.address[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isDisable}
          className={`w-full bg-indigo-600 text-white py-2 font-semibold rounded hover:bg-indigo-700 ${
            isDisable ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isDisable ? "Updating Product..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
