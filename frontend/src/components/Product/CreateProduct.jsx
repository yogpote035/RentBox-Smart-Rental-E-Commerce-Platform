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
import {
  Package,
  MapPin,
  Upload,
  Plus,
  IndianRupee,
  FileText,
  Tag,
} from "lucide-react";

function CreateProduct() {
  const navigate = useNavigate();
  const { createProduct } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
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
  const [imagePreview, setImagePreview] = useState(null);
  const [isDisable, setIsDisable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisable(true);

    const finalProduct = { ...formData };

    const id = await createProduct(finalProduct, image);
    setTimeout(() => setIsDisable(false), 2000);

    if (id) navigate(`/rental/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
        
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add New Rental
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Fill in the details to list your item for rent
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Package size={20} className="text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Product Information
                </h3>
              </div>

              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="text-indigo-600" />
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., DSLR Camera, Mountain Bike, etc."
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="text-indigo-600" />
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your product in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee size={16} className="text-indigo-600" />
                  Rental Price
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </div>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <span>Rental price</span>
                  <span className="text-indigo-600 font-medium">per day</span>
                </p>
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Tag size={20} className="text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Select Categories
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Choose one or more categories that best describe your product
              </p>
              <div className="flex flex-wrap gap-2">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      formData.categories.includes(name)
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                    }`}
                  >
                    <span className="text-base">{icon}</span>
                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Upload size={20} className="text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Product Image
                </h3>
              </div>
              <div className="space-y-3">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    imagePreview
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}>
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg shadow-md"
                        />
                        <p className="text-sm text-indigo-600 font-medium">
                          Image selected • Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload size={40} className="text-gray-400 mx-auto" />
                        <div>
                          <p className="text-gray-700 font-medium">
                            Click to upload product image
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <MapPin size={20} className="text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Product Location
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Building Name
                  </label>
                  <input
                    type="text"
                    name="buildingName"
                    placeholder="Enter building name"
                    value={formData.address.buildingName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Lane No / Area
                  </label>
                  <input
                    type="text"
                    name="laneNo"
                    placeholder="Enter lane or area"
                    value={formData.address.laneNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Nearby landmark"
                    value={formData.address.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Enter country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="number"
                    name="pincode"
                    placeholder="Enter pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.address.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  isDisable ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDisable}
              >
                {isDisable ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;