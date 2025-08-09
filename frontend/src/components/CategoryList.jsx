import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import soups from "../assets/Soups.jpg";
import starters from "../assets/Starters.jpg";
import mainCourse from "../assets/MainCourse.jpg";
import breads from "../assets/Breads.jpg";
import riceandBiryani from "../assets/RiceandBiryani.jpg";
import southIndian from "../assets/SouthIndian.jpg";
import chinese from "../assets/Chinese.jpg";
import pizzaandPasta from "../assets/PizzaandPasta.jpg";
import burgersandSandwiches from "../assets/BurgersandSandwiches.jpg";
import snacksandChaat from "../assets/SnacksandChaat.jpg";
import momos from "../assets/Momos.jpg";
import desserts from "../assets/Desserts.jpg";
import drinks from "../assets/Drinks.jpg";

const categories = [
  { name: "Soups", image: soups },
  { name: "Starters", image: starters },
  { name: "Main Course", image: mainCourse },
  { name: "Breads", image: breads },
  { name: "Rice and Biryani", image: riceandBiryani },
  { name: "South Indian", image: southIndian },
  { name: "Chinese", image: chinese },
  { name: "Pizza and Pasta", image: pizzaandPasta },
  { name: "Burgers and Sandwiches", image: burgersandSandwiches },
  { name: "Snacks and Chaat", image: snacksandChaat },
  { name: "Momos", image: momos },
  { name: "Desserts", image: desserts },
  { name: "Drinks", image: drinks },
];

const glowColors = [
  "from-pink-500 to-red-400",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-emerald-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-fuchsia-500",
  "from-teal-400 to-cyan-500",
  "from-rose-400 to-pink-500",
];

const CategoryList = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative mt-10 px-4 sm:px-8 md:px-16 py-12 bg-gradient-to-br from-black via-zinc-800 to-black rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-10 tracking-wide drop-shadow-lg">
        Explore <span className="text-green-400">Menu Categories</span>
      </h2>

      <div className="flex overflow-x-auto gap-6 px-2 pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar">
        {categories.map((cat, idx) => {
          const gradient = glowColors[idx % glowColors.length];

          return (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              title={cat.name}
              className={`flex flex-col items-center justify-center min-w-[90px] sm:min-w-[110px] snap-center cursor-pointer group transition-all duration-300 ease-in-out hover:scale-101 ${
                activeCategory === cat.name ? "scale-110" : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br ${gradient} p-[3px] rounded-full shadow-lg transition-all duration-500`}
              >
                <div className="bg-black rounded-full w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
              <p
                className={`mt-3 text-center text-sm sm:text-base text-white font-medium group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${gradient} transition-all duration-300 max-w-[110px] truncate`}
              >
                {cat.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryList;
