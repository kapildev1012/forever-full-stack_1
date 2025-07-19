import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Local images from /assets
import beauty from "../assets/beauty.jpg";
import fashion from "../assets/fashion.jpg";
import electronics from "../assets/electronics.jpg";
import appliances from "../assets/appliances.jpg";
import grocery from "../assets/grocery.jpg";
import sports from "../assets/sports.jpg";
import home from "../assets/home.jpg";

const categories = [
  { name: "Beauty & Personal Care", image: beauty },
  { name: "Fashion", image: fashion },
  { name: "Electronics", image: electronics },
  { name: "Appliances", image: appliances },
  { name: "Grocery", image: grocery },
  { name: "Sports, Books & More", image: sports },
  { name: "Home & Furniture", image: home },
];

const CategoryList = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <section
      className="relative mt-3 px-6 sm:px-10 md:px-16 lg:px-24 py-12 md:py-20 bg-gradient-to-br from-green-600 via-green-300 to-green-100 shadow-2xl rounded-3xl border border-emerald-300/40 backdrop-blur-md
"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Shop by <span className="text-gray-900">Category</span>
      </h2>

      {/* Scrollable Row */}
      <div className="flex overflow-x-auto gap-5 px-2 pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            title={cat.name}
            className={`flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] snap-center cursor-pointer group transition-all duration-300 ${
              activeCategory === cat.name
                ? "ring-2 ring-green-500 scale-105"
                : ""
            }`}
          >
            <div
              className={`w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden shadow-md border-2 ${
                activeCategory === cat.name
                  ? "border-green-500 shadow-green-200"
                  : "border-green-200"
              } group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-center text-sm sm:text-base text-gray-800 group-hover:text-green-700 font-medium truncate max-w-[90px]">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
