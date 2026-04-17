import { Link } from "react-router-dom";
import { Code, Home, Info, Plus, Package } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about-dev", label: "About", icon: Info },
    { to: "/create-rental", label: "Add Rental", icon: Plus },
    { to: "/my-rentals", label: "My Rentals", icon: Package },
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">

          {/* Brand */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-registered text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold">RentBox</h2>
            </div>
            <p className="text-sm text-indigo-200">
              Your trusted platform for renting anything, anytime
            </p>
            <p className="text-xs text-indigo-300 mt-2">
              © {currentYear} RentBox. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-200">
              Quick Links
            </h3>

            {/* Responsive layout */}
            <div className="flex flex-col md:flex-row md:flex-wrap items-center md:items-start justify-center md:justify-start gap-3 md:gap-6">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 text-indigo-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-indigo-700/50 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-indigo-200">
          <div className="flex items-center gap-2">
            <Code size={16} />
            <span>Built with MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;