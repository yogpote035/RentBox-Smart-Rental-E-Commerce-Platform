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
    <div className="bg-white sticky top-0 z-10 border-b border-indigo-600">
      {/* Left scroll button */}
      <button
        onClick={() => scroll(-200)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white px-2 py-1 hidden md:flex"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Category Scrollable List */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar gap-2 py-4 md:px-10 lg:px-10"
      >
        <button
          onClick={() => onSelect("")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-1 rounded-full border text-sm font-medium transition-all duration-200 ${
            selected === ""
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          All
        </button>

        {Object.entries(categoryIcons).map(([key, icon]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-1 rounded-full border text-sm font-medium transition-all duration-200 ${
              selected === key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {icon}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll(200)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white px-2 py-1 hidden md:flex"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}
