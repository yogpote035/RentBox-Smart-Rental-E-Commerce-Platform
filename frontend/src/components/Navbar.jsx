import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../context/Authentication/UserContext";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import logo from "/utils/Logo.png";

function Navbar() {
  const { logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-indigo-700 font-medium hover:underline"
            >
              Home
            </Link>
          )}

          {location.pathname !== "/" && (
            <Link
              to="/create-product"
              className="text-indigo-700 font-medium hover:underline"
            >
              Add Item
            </Link>
          )}

          <Link
            to="/my-products"
            className="text-indigo-700 font-medium hover:underline"
          >
            My Products
          </Link>

          <Link to="/my-favorite" className="text-indigo-700 hover:text-red-600">
            <FaHeart size={20} />
          </Link>

          <Link to="/my-orders" className="text-indigo-700 hover:text-green-600">
            <FaShoppingCart size={20} />
          </Link>

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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-indigo-700">
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-2 space-y-3">
          {location.pathname !== "/" && (
            <Link
              to="/"
              onClick={closeMenu}
              className="block text-indigo-700 font-medium"
            >
              Home
            </Link>
          )}

          {location.pathname !== "/" && (
            <Link
              to="/create-product"
              onClick={closeMenu}
              className="block text-indigo-700 font-medium"
            >
              Add Item
            </Link>
          )}

          <Link
            to="/my-products"
            onClick={closeMenu}
            className="block text-indigo-700 font-medium"
          >
            My Products
          </Link>

          <Link
            to="/my-favorite"
            onClick={closeMenu}
            className="block text-indigo-700 flex items-center gap-2"
          >
            <FaHeart /> Favorites
          </Link>

          <Link
            to="/my-orders"
            onClick={closeMenu}
            className="block text-indigo-700 flex items-center gap-2"
          >
            <FaShoppingCart /> Orders
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full bg-indigo-500 text-white text-center px-4 py-2 rounded hover:bg-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block w-full bg-gray-200 text-indigo-700 text-center px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
