import {
  FaBolt,
  FaBicycle,
  FaCar,
  FaCouch,
  FaBook,
  FaTools,
  FaTshirt,
  FaMobileAlt,
  FaFootballBall,
  FaQuestionCircle,
  FaHouseDamage,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useRef } from "react";

const categoryIcons = {
  electric: <FaBolt />,
  bike: <FaBicycle />,
  vehicle: <FaCar />,
  furniture: <FaCouch />,
  books: <FaBook />,
  tools: <FaTools />,
  clothing: <FaTshirt />,
  gadgets: <FaMobileAlt />,
  sports: <FaFootballBall />,
  property: <FaHouseDamage />,
  other: <FaQuestionCircle />,
};

export default function CategoryNavbar({ selected, onSelect }) {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button
        onClick={() => scroll(-200)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white to-transparent hover:from-gray-50 px-3 py-8 hidden sm:flex items-center justify-center transition-all"
      >
        <FaChevronLeft size={18} className="text-indigo-600" />
      </button>

      {/* Category Scrollable List */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 py-2 px-1 sm:px-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          onClick={() => onSelect("")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
            selected === ""
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
              : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
          }`}
        >
          All
        </button>

        {Object.entries(categoryIcons).map(([key, icon]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
              selected === key
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
            }`}
          >
            <span className="text-base">{icon}</span>
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll(200)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white to-transparent hover:from-gray-50 px-3 py-8 hidden sm:flex items-center justify-center transition-all"
      >
        <FaChevronRight size={18} className="text-indigo-600" />
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}