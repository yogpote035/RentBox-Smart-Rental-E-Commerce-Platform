import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-indigo-900 text-white py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Brand Info */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold">RentBox</h2>
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} RentBox. All rights reserved.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/" className="hover:text-sky-400">
            Home
          </Link>
          <Link to="/about-dev" className="hover:text-sky-400">
            About
          </Link>
          <Link to="/create-rental" className="hover:text-sky-400">
            Add Rental
          </Link>
          <Link to="/my-rentals" className="hover:text-sky-400">
            My Rentals
          </Link>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4 text-lg">
          <a
            href="https://github.com/yogpote035"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/yogesh-pote"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300"
          >
            <FaLinkedin />
          </a>
          <a href="mailto:yogpote035@gmail.com" className="hover:text-red-300">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
