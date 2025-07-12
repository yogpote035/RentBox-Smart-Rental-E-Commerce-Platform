import { useState, useContext } from "react";
import UserContext from "../../context/Authentication/UserContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { signup } = context;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isDisable, setIsDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisable(true);

    const res = await signup(formData);

    setTimeout(() => {
      setIsDisable(false);
    }, 4000);

    if (res === true) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          Welcome On RentBox Please SignUp
        </h2>

        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password with show/hide toggle */}
        <div className="relative">
          <label className="block font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-indigo-600"
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit button */}
        <button
          disabled={isDisable}
          type="submit"
          className={`w-full py-2 font-semibold rounded shadow ${
            isDisable
              ? "bg-rose-600 text-gray-200 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {isDisable ? "Validating Credentials..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
