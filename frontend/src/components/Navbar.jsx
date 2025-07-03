import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../context/Authentication/UserContext";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import logo from "/utils/Logo.png";
import logo2 from "/utils/RENTBOX.png";

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
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto  md:hidden lg:block sm:block space-x-0.5"
          />{" "}
          <img
            src={logo2}
            alt="Logo"
            className="h-7 w-25 hidden md:block lg:hidden sm:hidden"
          />{" "}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!["/login", "/signup"].includes(location.pathname) && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center gap-2"
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

          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-indigo-700 font-medium hover:underline"
            >
              Home
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {location.pathname !== "/" && (
                <Link
                  to="/create-product"
                  className="text-indigo-700 font-medium hover:underline"
                >
                  Add Rental
                </Link>
              )}

              <Link
                to="/my-products"
                className="text-indigo-700 font-medium hover:underline"
              >
                My Rentals
              </Link>
              <Link
                to="/my-favorite"
                className="text-indigo-700 hover:text-red-600"
              >
                <FaHeart size={20} />
              </Link>

              <Link
                to="/my-rentals"
                className="text-indigo-700 hover:text-green-600"
              >
                <FaShoppingCart size={20} />
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
                className="bg-gray-200 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-200 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-100 transition"
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
          <form
            onSubmit={handleSearch}
            className="md:hidden flex gap-2 px-2 pb-3 items-center"
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

          {location.pathname !== "/" && (
            <Link
              to="/"
              onClick={closeMenu}
              className="block text-indigo-700 font-medium"
            >
              Home
            </Link>
          )}
          {isAuthenticated && (
            <>
              {location.pathname !== "/" && (
                <Link
                  to="/create-product"
                  onClick={closeMenu}
                  className="block text-indigo-700 font-medium"
                >
                  Add Rental(Any thing)
                </Link>
              )}

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
                className="text-indigo-700 flex items-center gap-2"
              >
                <FaHeart /> Favorites
              </Link>

              <Link
                to="/my-rentals"
                onClick={closeMenu}
                className="text-indigo-700 flex items-center gap-2"
              >
                <FaShoppingCart /> Rentals
              </Link>
            </>
          )}
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
