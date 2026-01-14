import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Heart, Code, ExternalLink, Home, Info, Plus, Package } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about-dev", label: "About", icon: Info },
    { to: "/create-rental", label: "Add Rental", icon: Plus },
    { to: "/my-rentals", label: "My Rentals", icon: Package },
  ];

  const socialLinks = [
    {
      href: "https://github.com/yogpote035",
      icon: FaGithub,
      label: "GitHub",
      hoverColor: "hover:text-gray-300",
      bgColor: "hover:bg-gray-800",
    },
    {
      href: "https://linkedin.com/in/yogesh-pote",
      icon: FaLinkedin,
      label: "LinkedIn",
      hoverColor: "hover:text-blue-400",
      bgColor: "hover:bg-blue-600",
    },
    {
      href: "mailto:yogpote035@gmail.com",
      icon: FaEnvelope,
      label: "Email",
      hoverColor: "hover:text-red-400",
      bgColor: "hover:bg-red-600",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-registered text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                RentBox
              </h2>
            </div>
            <p className="text-sm text-indigo-200 mb-2">
              Your trusted platform for renting anything, anytime
            </p>
            <p className="text-xs text-indigo-300/80">
              © {currentYear} RentBox. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-indigo-200">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center justify-center gap-2 text-indigo-100 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
                  >
                    <IconComponent size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4 text-indigo-200">Connect With Us</h3>
            <div className="flex justify-center md:justify-end gap-3 mb-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`flex items-center justify-center w-10 h-10 bg-white/10 ${social.bgColor} rounded-lg transition-all ${social.hoverColor} backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110`}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-indigo-200">
              Have questions? Reach out to us!
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-indigo-700/50 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-indigo-200">
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <Heart size={16} className="text-red-400 fill-red-400 animate-pulse" />
              <span>by</span>
              <a
                href="https://yogpote035.github.io/Portfolio-Website/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-indigo-100 hover:text-white inline-flex items-center gap-1 hover:underline"
              >
                Yogesh Pote
                <ExternalLink size={14} />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Code size={16} className="text-indigo-300" />
              <span>Built with MERN Stack</span>
            </div>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;