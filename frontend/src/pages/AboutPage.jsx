import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";
import profileImg from "/utils/yogesh-profile.jpg";

function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-12">
        About RentBox & Developer
      </h1>

      {/* Project Overview */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-sky-700 mb-4">
          🛠 Project Overview
        </h2>
        <p className="text-lg mb-4">
          <strong>RentBox</strong> is a MERN stack-based rental platform where
          users can list, browse, rent, and review a wide range of products
          including electronics, tools, and lifestyle items. It’s built with
          scalability, usability, and security in mind.
        </p>

        <h3 className="text-xl font-semibold text-sky-600 mt-6 mb-2">
          ✨ Key Features
        </h3>
        <ul className="list-disc pl-6 space-y-1 text-base">
          <li>
            🔐 <strong>JWT Authentication:</strong> Secure Login & Register with
            protected routes
          </li>
          <li>
            ➕ <strong>Product Management:</strong> Add, edit, and delete your
            own product listings
          </li>
          <li>
            🖼️ <strong>Image Uploads:</strong> Handled using Multer middleware
          </li>
          <li>
            📆 <strong>Date-based Rentals:</strong> Book products for any date
            range
          </li>
          <li>
            ❌ <strong>Conflict Prevention:</strong> Prevents overlapping
            bookings (via <code>date-fns</code>)
          </li>
          <li>
            ⭐ <strong>Review System:</strong> Verified users can submit one
            review per rental
          </li>
          <li>
            📊 <strong>Auto-calculated Ratings:</strong> Product rating shown
            based on reviews
          </li>
          <li>
            🗂️ <strong>User Dashboards:</strong> My Listings & My Rentals
            sections
          </li>
          <li>
            🔍 <strong>Smart Search + Filters:</strong> Title, rating, category,
            availability
          </li>
          <li>
            💬 <strong>Real-time:</strong> Chat & alerts via{" "}
            <code>socket.io</code>
          </li>
          <li>
            🧾 <strong>PDF Receipt:</strong> Rental receipts generated using{" "}
            <code>pdf-kit</code>
          </li>
          <li>
            🛠️ <strong>Admin Panel:</strong> Role-based admin to manage users &
            rentals
          </li>
          <li>
            💳 <strong>Payment Integration:</strong> (Razorpay or Stripe for
            rent collection)
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-sky-600 mt-6 mb-2">
          ⚙️ Tech Stack
        </h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 text-md list-disc pl-5">
          <li>
            <strong>Frontend:</strong> React.js, Tailwind CSS, React Router
          </li>
          <li>
            <strong>Backend:</strong> Node.js, Express.js
          </li>
          <li>
            <strong>Database:</strong> MongoDB with Mongoose
          </li>
          <li>
            <strong>Authentication:</strong> JWT
          </li>
          <li>
            <strong>File Uploads:</strong> Multer
          </li>
          <li>
            <strong>Real-time:</strong> Socket.IO
          </li>
          <li>
            <strong>PDF Generation:</strong> PDF-Kit
          </li>
          <li>
            <strong>Date Utilities:</strong> date-fns
          </li>
          <li>
            <strong>Icons:</strong> react-icons
          </li>
          <li>
            <strong>Testing & Debugging:</strong> Postman
          </li>
          <li>
            <strong>Version Control:</strong> Git, GitHub
          </li>
          <li>
            <strong>Deployment:</strong> Render, GitHub Pages
          </li>
        </ul>
      </section>

      {/* Developer Section */}
      <section className="bg-white shadow-lg p-6 border border-indigo-800 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={profileImg}
          alt="Yogesh Pote"
          className="w-60 h-60 md:w-72 md:h-72 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
            👨‍💻 Yogesh Pote
          </h2>
          <p className="mb-3 text-gray-700">
            A passionate MERN Stack Developer and 3rd year B.Sc Computer Science
            student at Modern College, Pune. I enjoy turning real-world problems
            into clean, scalable web solutions.
          </p>

          <p className="text-sm text-gray-600 mb-4">
            📧 <strong>Email:</strong> yogpote035@gmail.com &nbsp; | &nbsp; 📞{" "}
            <strong>Phone:</strong> 8999390368
          </p>

          <div className="flex items-center gap-4 text-indigo-700 text-xl mb-4">
            <a
              href="https://github.com/yogpote035"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="hover:text-black" />
            </a>
            <a
              href="https://linkedin.com/in/yogesh-pote"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="hover:text-blue-700" />
            </a>
            <a href="mailto:yogpote035@gmail.com">
              <FaEnvelope className="hover:text-red-500" />
            </a>
            <a
              href="https://yogpote035.github.io/Portfolio-Website/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm"
            >
              Portfolio <FaExternalLinkAlt size={14} />
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-sky-700 mb-2">
              🚀 Skills
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Mongoose",
                "Git",
                "GitHub",
                "Tailwind",
                "Bootstrap",
                "REST API",
                "MySQL",
                "C",
                "C++",
                "Java",
                "OOP",
                "DSA",
                "Python",
                "R",
                "Postman",
                "Socket.IO",
                "PDF-Kit",
                "Multer",
                "date-fns",
                "VS Code",
                "Linux Basics",
                "Computer Networks",
                "Operating Systems",
              ].map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
