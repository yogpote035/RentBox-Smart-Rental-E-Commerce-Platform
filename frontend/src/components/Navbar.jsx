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
import {
  Search,
  Plus,
  Package,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";

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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              closeMenu();
              setUserPopupOpen(false);
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <i className="fa-solid fa-registered text-white text-xl" />
            </div>
            <span className="hidden sm:inline text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              RENTBOX
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {!["/login", "/signup"].includes(location.pathname) && (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg outline-none w-64 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    aria-label="Search products"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </form>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-rental"
                  className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => setUserPopupOpen(false)}
                >
                  <Plus size={18} />
                  <span className="hidden xl:inline">Add Rental</span>
                </Link>
                <Link
                  to="/my-rentals"
                  className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => setUserPopupOpen(false)}
                >
                  <Package size={18} />
                  <span className="hidden xl:inline">My Rentals</span>
                </Link>
                <Link
                  to="/my-favorite"
                  className="text-indigo-700 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                  onClick={() => setUserPopupOpen(false)}
                  aria-label="Favorites"
                  title="Favorites"
                >
                  <FaHeart size={20} />
                </Link>
                <Link
                  to="/rentals-cart"
                  className="text-indigo-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition"
                  onClick={() => setUserPopupOpen(false)}
                  aria-label="Cart"
                  title="Cart"
                >
                  <FaShoppingCart size={20} />
                </Link>

                {/* User Icon */}
                <div
                  ref={userPopupRef}
                  className="relative"
                  onMouseLeave={() => setUserPopupOpen(false)}
                >
                  <button
                    onClick={toggleUserPopup}
                    className="text-indigo-700 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition"
                    title={username}
                    aria-haspopup="true"
                    aria-expanded={userPopupOpen}
                  >
                    <FaUserCircle size={24} />
                  </button>

                  {userPopupOpen && (
                    <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px] z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {username}
                        </p>
                      </div>
                      
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium shadow-md hover:shadow-lg"
                >
                  <LogOut size={18} />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white border border-gray-300 text-indigo-700 hover:bg-indigo-50 px-5 py-2 rounded-lg transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg transition font-medium shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && (
              <div ref={userPopupRef} className="relative">
                <button
                  onClick={toggleUserPopup}
                  className="text-indigo-700 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition"
                  title={username}
                  aria-haspopup="true"
                  aria-expanded={userPopupOpen}
                >
                  <FaUserCircle size={24} />
                </button>
                {userPopupOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px] z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {username}
                      </p>
                    </div>
                  
                  </div>
                )}
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="text-indigo-700 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {!["/login", "/signup"].includes(location.pathname) && (
              <form onSubmit={handleSearch} className="pb-3 border-b border-gray-200">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    aria-label="Search products"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-lg transition font-medium shadow-md"
                >
                  Search
                </button>
              </form>
            )}

            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-3 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 font-medium px-3 py-2.5 rounded-lg transition"
            >
              <Home size={20} />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-rental"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 font-medium px-3 py-2.5 rounded-lg transition"
                >
                  <Plus size={20} />
                  Add Rental
                </Link>
                <Link
                  to="/my-rentals"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 font-medium px-3 py-2.5 rounded-lg transition"
                >
                  <Package size={20} />
                  My Rentals
                </Link>
                <Link
                  to="/my-favorite"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-gray-700 hover:text-red-700 hover:bg-red-50 font-medium px-3 py-2.5 rounded-lg transition"
                >
                  <FaHeart size={20} />
                  Favorites
                </Link>
                <Link
                  to="/rentals-cart"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-3 py-2.5 rounded-lg transition"
                >
                  <FaShoppingCart size={20} />
                  Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition font-medium shadow-md mt-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full bg-white border border-gray-300 text-indigo-700 hover:bg-indigo-50 text-center px-4 py-2.5 rounded-lg transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center px-4 py-2.5 rounded-lg transition font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;