import { useState, useContext } from "react";
import ProductContext from "../../context/Product/ProductContext";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaBicycle,
  FaCar,
  FaCouch,
  FaBook,
  FaTools,
  FaTshirt,
  FaMobileAlt,
  FaFootballBall,
  FaQuestionCircle,
  FaHouseDamage,
} from "react-icons/fa";

function CreateProduct() {
  const navigate = useNavigate();
  const { createProduct } = useContext(ProductContext);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address
    if (
      [
        "buildingName",
        "laneNo",
        "landmark",
        "city",
        "state",
        "country",
        "pincode",
        "phone",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleCategory = (category) => {
    setFormData((prev) => {
      const alreadySelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisable(true);

    const finalProduct = {
      ...formData,
      price: `${formData.priceNumber}/${formData.priceUnit}`,
    };
    console.log(finalProduct);
    delete finalProduct.priceNumber;
    delete finalProduct.priceUnit;

    const id = await createProduct(finalProduct, image);
    setTimeout(() => setIsDisable(false), 2000);
    if (id) navigate(`/rental/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-1 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold text-center text-indigo-600 mb-6">
        Add New Rental's
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Info */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded outline-none"
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded outline-none"
          required
        />

        <div className="grid grid-rows-1 gap-0">
          <input
            type="number"
            name="priceNumber"
            placeholder="Price (₹)"
            value={formData.priceNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="priceUnit"
            value={formData.priceUnit || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-4"
            required
          >
            <option value="" disabled>
              Select Price Unit
            </option>
            <option value="per hour">Per Hour</option>
            <option value="per day">Per Day</option>
            <option value="per week">Per Week</option>
            <option value="per month">Per Month</option>
            <option value="per year">Per Year</option>
          </select>
          <br />
          <h3 className="text-lg font-semibold text-gray-800">
            🏷️ Select Categories
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
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
            ].map(({ name, icon }) => (
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
        </div>

        {/* Categories */}

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 border rounded"
          required
        />

        <hr className="my-4" />

        {/* Address Section */}
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">
          📍 Address Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <input
            type="text"
            name="buildingName"
            placeholder="Building Name"
            value={formData.address.buildingName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="laneNo"
            placeholder="Lane No / Area"
            value={formData.address.laneNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={formData.address.landmark}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.address.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="pincode"
            placeholder="Pincode"
            value={formData.address.pincode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="phone"
            placeholder="Phone No."
            value={formData.address.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition ${
            isDisable ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isDisable}
        >
          {isDisable ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
