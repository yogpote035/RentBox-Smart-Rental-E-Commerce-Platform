import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../context/Authentication/UserContext";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const { logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          {/* Show R icon only on small screens (hide on md & above) */}
          <i className="fa-solid fa-registered text-indigo-600 text-3xl md:hidden block"></i>

          {/* RENTBOX text on medium and larger screens */}
          <span className="hidden md:inline text-indigo-700 text-2xl font-bold tracking-wide">
            RENTBOX
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search */}
          {!["/login", "/signup"].includes(location.pathname) && (
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="border border-gray-300 px-3 py-1.5 rounded-md outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition"
              >
                Search
              </button>
            </form>
          )}

          {/* Navigation Links */}
          {isAuthenticated ? (
            <>
              <Link to="/create-product" className="text-indigo-700 hover:underline">
                Add Rental
              </Link>
              <Link to="/my-products" className="text-indigo-700 hover:underline">
                My Rentals
              </Link>
              <Link to="/my-favorite" className="text-indigo-700 hover:text-red-600">
                <FaHeart size={18} />
              </Link>
              <Link to="/my-rentals" className="text-indigo-700 hover:text-green-600">
                <FaShoppingCart size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gray-100 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-100 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-indigo-700">
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-2 space-y-3">
          {/* Search */}
          {!["/login", "/signup"].includes(location.pathname) && (
            <form
              onSubmit={handleSearch}
              className="flex gap-2 px-2 pb-3 items-center"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-300 px-3 py-1.5 rounded-md outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition"
              >
                Go
              </button>
            </form>
          )}

          {/* Links */}
          <Link
            to="/"
            onClick={closeMenu}
            className="block text-indigo-700 font-medium"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-product"
                onClick={closeMenu}
                className="block text-indigo-700 font-medium"
              >
                Add Rental
              </Link>
              <Link
                to="/my-products"
                onClick={closeMenu}
                className="block text-indigo-700 font-medium"
              >
                My Rentals
              </Link>
              <Link
                to="/my-favorite"
                onClick={closeMenu}
                className="flex items-center gap-2 text-indigo-700"
              >
                <FaHeart /> Favorites
              </Link>
              <Link
                to="/my-rentals"
                onClick={closeMenu}
                className="flex items-center gap-2 text-indigo-700"
              >
                <FaShoppingCart /> Rentals
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full bg-indigo-500 text-white text-center px-4 py-2 rounded hover:bg-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block w-full bg-gray-100 text-indigo-700 text-center px-4 py-2 rounded hover:bg-gray-200"
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
