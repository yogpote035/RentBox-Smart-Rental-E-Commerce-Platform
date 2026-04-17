import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  Code,
  Shield,
  Calendar,
  Star,
  Search,
  MessageCircle,
  FileText,
  Settings,
  CreditCard,
  Wrench,
  Package,
  Sparkles,
  User,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import profileImg from "/utils/yogesh-profile.jpg";

function AboutPage() {
  const features = [
    { icon: Shield, text: "JWT Authentication: Secure Login & Register with protected routes" },
    { icon: Package, text: "Product Management: Add, edit, and delete your own product listings" },
    { icon: FileText, text: "Image Uploads: Handled using Multer middleware" },
    { icon: Calendar, text: "Date-based Rentals: Book products for any date range" },
    { icon: Shield, text: "Conflict Prevention: Prevents overlapping bookings (via date-fns)" },
    { icon: Star, text: "Review System: Verified users can submit one review per rental" },
    { icon: Star, text: "Auto-calculated Ratings: Product rating shown based on reviews" },
    { icon: Package, text: "User Dashboards: My Listings & My Rentals sections" },
    { icon: Search, text: "Smart Search + Filters: Title, rating, category, availability" },
    { icon: MessageCircle, text: "Real-time: Chat & alerts via socket.io" },
    { icon: FileText, text: "PDF Receipt: Rental receipts generated using pdf-kit" },
    { icon: Settings, text: "Admin Panel: Role-based admin to manage users & rentals" },
    { icon: CreditCard, text: "Payment Integration: Razorpay or Stripe for rent collection" },
  ];

  const techStack = [
    { label: "Frontend", value: "React.js, Tailwind CSS, React Router" },
    { label: "Backend", value: "Node.js, Express.js" },
    { label: "Database", value: "MongoDB with Mongoose" },
    { label: "Authentication", value: "JWT" },
    { label: "File Uploads", value: "Multer" },
    { label: "Real-time", value: "Socket.IO" },
    { label: "PDF Generation", value: "PDF-Kit" },
    { label: "Date Utilities", value: "date-fns" },
    { label: "Icons", value: "react-icons" },
    { label: "Testing", value: "Postman" },
    { label: "Version Control", value: "Git, GitHub" },
    { label: "Deployment", value: "Render, GitHub Pages" },
  ];

  const skills = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
    "MongoDB", "Mongoose", "Git", "GitHub", "Tailwind", "Bootstrap",
    "REST API", "MySQL", "C", "C++", "Java", "OOP", "DSA", "Python",
    "R", "Postman", "Socket.IO", "PDF-Kit", "Multer", "date-fns",
    "VS Code", "Linux Basics", "Computer Networks", "Operating Systems",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Code size={28} className="text-white sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              About RentBox
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-indigo-500" />
            <p className="text-gray-600 text-base sm:text-lg">
              A modern rental platform built with passion
            </p>
            <Sparkles size={16} className="text-indigo-500" />
          </div>
        </div>

        {/* Project Overview */}
        <section className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Wrench size={24} className="text-indigo-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Project Overview
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
            <strong className="text-indigo-600">RentBox</strong> is a MERN stack-based rental platform where
            users can list, browse, rent, and review a wide range of products
            including electronics, tools, and lifestyle items. It's built with
            scalability, usability, and security in mind.
          </p>

          {/* Key Features */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Sparkles size={20} className="text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Key Features
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <IconComponent size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Code size={20} className="text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Tech Stack
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-semibold text-indigo-700 mb-1">
                    {tech.label}
                  </p>
                  <p className="text-sm text-gray-700">
                    {tech.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
       
      </div>
    </div>
  );
}

export default AboutPage;