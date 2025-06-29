import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/Authentication/UserContext";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import logo from "/utils/Logo.png";

function Navbar() {
  const { logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Show Home if not on "/" */}
        {location.pathname !== "/" && (
          <Link
            to="/"
            className="text-indigo-700 font-medium hover:underline transition"
          >
            Home
          </Link>
        )}
        {/* Create product  */}
        {location.pathname !== "/" && (
          <Link
            to="/create-product"
            className="text-indigo-700 font-medium hover:underline transition"
          >
            Add Item
          </Link>
        )}
        <Link
          to="/my-products"
          className="text-indigo-700 font-medium hover:underline transition"
        >
          My Products
        </Link>

        {/* Favorite Icon */}
        <Link to="/my-favorite" className="text-indigo-700 hover:text-red-600">
          <FaHeart size={20} />
        </Link>

        {/* Cart Icon */}
        <Link to="/my-orders" className="text-indigo-700 hover:text-green-600">
          <FaShoppingCart size={20} />
        </Link>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-indigo-500 text-white px-4 py-1.5 rounded hover:bg-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gray-200 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-300 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
