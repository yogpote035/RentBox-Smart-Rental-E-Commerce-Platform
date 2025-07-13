import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../context/Authentication/UserContext";
import {
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  const { logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const userPopupRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem("username") || "";
      setUsername(storedUser);
    } else {
      setUsername("");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target)
      ) {
        setUserPopupOpen(false);
      }
    }
    if (userPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userPopupOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
    setUserPopupOpen(false);
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
  const toggleUserPopup = () => setUserPopupOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          onClick={() => {
            closeMenu();
            setUserPopupOpen(false);
          }}
          className="flex items-center gap-2"
        >
          <i className="fa-solid fa-registered text-indigo-600 text-3xl md:hidden block" />
          <span className="hidden md:inline text-indigo-700 text-2xl font-bold tracking-wide">
            RENTBOX
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!["/login", "/signup"].includes(location.pathname) && (
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 min-w-[250px]"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="border border-gray-300 px-3 py-1.5 rounded-md outline-none w-full focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Search
              </button>
            </form>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to="/create-rental"
                className="text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                onClick={() => setUserPopupOpen(false)}
              >
                Add Rental
              </Link>
              <Link
                to="/my-rentals"
                className="text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                onClick={() => setUserPopupOpen(false)}
              >
                My Rentals
              </Link>
              <Link
                to="/my-favorite"
                className="text-indigo-700 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                onClick={() => setUserPopupOpen(false)}
                aria-label="Favorites"
              >
                <FaHeart size={18} />
              </Link>
              <Link
                to="/rentals-cart"
                className="text-indigo-700 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                onClick={() => setUserPopupOpen(false)}
                aria-label="Cart"
              >
                <FaShoppingCart size={18} />
              </Link>

              {/* User Icon */}
              <div
                ref={userPopupRef}
                className="relative group"
                onMouseLeave={() => setUserPopupOpen(false)}
              >
                <div
                  onClick={toggleUserPopup}
                  className="cursor-pointer text-indigo-700 p-1 rounded focus-visible:ring-2 focus-visible:ring-indigo-500"
                  title={username}
                  aria-haspopup="true"
                  aria-expanded={userPopupOpen}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleUserPopup();
                  }}
                >
                  <FaUserCircle size={24} />
                </div>

                <div
                  className={`absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-indigo-700 text-white text-sm rounded px-3 py-1 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:pointer-events-auto ${
                    userPopupOpen ? "opacity-100 pointer-events-auto" : ""
                  } z-50`}
                  style={{ minWidth: "max-content" }}
                >
                  {username}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-700 rotate-45" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition ml-4 focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gray-100 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-100 text-indigo-700 px-4 py-1.5 rounded hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Icons */}
        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated && (
            <div ref={userPopupRef} className="relative">
              <div
                onClick={toggleUserPopup}
                className="cursor-pointer text-indigo-700 p-1 rounded focus-visible:ring-2 focus-visible:ring-indigo-500"
                title={username}
                aria-haspopup="true"
                aria-expanded={userPopupOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleUserPopup();
                }}
              >
                <FaUserCircle size={24} />
              </div>
              {userPopupOpen && (
                <div
                  className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-indigo-700 text-white text-sm rounded px-3 py-1 whitespace-nowrap z-50"
                  style={{ minWidth: "max-content" }}
                >
                  {username}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-700 rotate-45" />
                </div>
              )}
            </div>
          )}
          <button
            onClick={toggleMenu}
            className="text-indigo-700 p-2 rounded focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-2 space-y-3">
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
                className="w-full border border-gray-300 px-3 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Go
              </button>
            </form>
          )}

          <Link
            to="/"
            onClick={closeMenu}
            className="block text-indigo-700 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-rental"
                onClick={closeMenu}
                className="block text-indigo-700 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
              >
                Add Rental
              </Link>
              <Link
                to="/my-rentals"
                onClick={closeMenu}
                className="block text-indigo-700 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
              >
                My Rentals
              </Link>
              <Link
                to="/my-favorite"
                onClick={closeMenu}
                className="flex items-center gap-2 text-indigo-700 focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
              >
                <FaHeart /> Favorites
              </Link>
              <Link
                to="/rentals-cart"
                onClick={closeMenu}
                className="flex items-center gap-2 text-indigo-700 focus-visible:ring-2 focus-visible:ring-green-500 rounded px-2 py-1"
              >
                <FaShoppingCart /> Rentals
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full bg-indigo-500 text-white text-center px-4 py-2 rounded hover:bg-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block w-full bg-gray-100 text-indigo-700 text-center px-4 py-2 rounded hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-400"
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
