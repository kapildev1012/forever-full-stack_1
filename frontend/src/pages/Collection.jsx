import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { FaSlidersH } from "react-icons/fa";
import { FiRotateCcw } from "react-icons/fi";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [availability, setAvailability] = useState("");
  const [rating, setRating] = useState(null);

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setAvailability("");
    setRating(null);
  };

  const sortProduct = (list) => {
    const sorted = [...list];
    if (sortType === "low-high") sorted.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  };
useEffect(() => {
  let filtered = [...products];

  if (showSearch && search) {
    filtered = filtered.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (subCategory.length > 0) {
    filtered = filtered.filter((item) =>
      subCategory.includes(item.subCategory)
    );
  }

  filtered = filtered.filter((item) => {
    const price = Number(item.price) || 0;
    const stars = Number(item.rating) || 0;
    const available = item.available !== false;

    return (
      price >= minPrice &&
      price <= maxPrice &&
      (availability === "" || available === (availability === "in")) &&
      (rating === null || stars >= rating)
    );
  });

  setFilterProducts(sortProduct(filtered));
}, [
  products,
  search,
  showSearch,
  subCategory,
  minPrice,
  maxPrice,
  availability,
  rating,
  sortType,
]);

return (
  <div className="flex flex-col sm:flex-row gap-4 pt-4 bg-gray-00 min-h-screen px-4 relative">
    {showFilter && (
      <div
        className="fixed inset-0 top-16 bg-black bg-opacity-40 z-40 sm:hidden"
        onClick={() => setShowFilter(false)}
      />
    )}

    {/* Mobile Filter Controls */}
    <div className="block sm:hidden mt-6 mb-4 px-1 z-20">
      <div className="flex gap-3 justify-between flex-wrap">
        {/* Apply Filters */}
        <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-2 shadow-md flex-1 min-w-[48%]">
          <div className="flex items-center gap-2">
            <FaSlidersH className="text-purple-600 text-lg" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-purple-800">
                Apply Filters
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="ml-2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium text-xs shadow hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            Open
          </button>
        </div>

        {/* Reset Filters */}
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-2 shadow-md flex-1 min-w-[48%]">
          <div className="flex items-center gap-2">
            <FiRotateCcw className="text-red-600 text-lg" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-red-800">
                Reset Filters
              </p>
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="ml-2 px-4 py-1 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-full font-medium text-xs shadow hover:from-red-700 hover:to-pink-600 transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

   <aside
      className={`bg-white shadow-lg rounded-none sm:rounded-xl p-4 transition-all duration-300 z-[999]
    ${
      showFilter
        ? "fixed inset-0 top-0 left-0 w-full h-full overflow-y-auto sm:static sm:w-64"
        : "hidden sm:block sm:w-64"
    }
  `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">Filters</h2>
        <button
          onClick={() => {
            
            setShowFilter(false);
          }}
          className="text-sm text-red-500 hover:underline sm:hidden"
        >
          Close
        </button>
      </div>

      <SubCategoryFilter
        subCategory={subCategory}
        setSubCategory={setSubCategory}
      />
      <PriceRange
        min={minPrice}
        max={maxPrice}
        setMin={setMinPrice}
        setMax={setMaxPrice}
      />
      <Availability value={availability} setValue={setAvailability} />
      <RatingSelector rating={rating} setRating={setRating} />
    </aside>

    <main className="flex-1">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <p className="text-sm text-gray-600">
          Showing <strong>{filterProducts.length}</strong> products
        </p>
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="border border-gray-400 px-3 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="relavent">Sort by: Relevant</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filterProducts.length > 0 ? (
          filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name || "No Name"}
              id={item._id || index}
              price={item.price || 0}
              image={item.image || assets.placeholder}
              rating={item.rating || 0}
              quantity={item.quantity || 0}
              subCategory={item.subCategory || ""}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-sm">
            No products found
          </p>
        )}
      </div>
    </main>
  </div>
);
};

const SubCategoryFilter = ({ subCategory, setSubCategory }) => {
  const groupedSubcategories = {
    Sweets: ["Dry Sweets", "Bengali Sweets", "Milk Sweets", "Laddu", "Barfi"],
    Namkeen: ["Sev", "Mixture", "Chakli", "Chivda"],
    Snacks: ["Samosa", "Kachori", "Pakoda"],
    Beverages: ["Lassi", "Chaas", "Milkshake", "Soft Drinks"],
    Bakery: ["Cake", "Pastry", "Cookies", "Toast"],
    "Soups & Starters": ["Soups", "Starters"],
    "Main Course": ["Paneer", "Dal", "Veg Curries", "Kofta", "Thali"],
    Breads: ["Roti", "Naan", "Paratha", "Kulcha"],
    "Rice and Biryani": ["Veg Biryani", "Jeera Rice", "Plain Rice", "Pulao"],
    "South Indian": ["Dosa", "Idli", "Vada", "Uttapam"],
    Chinese: ["Manchurian", "Chowmein", "Chilli Paneer"],
    "Fried Rice and Noodles": [
      "Veg Fried Rice",
      "Hakka Noodles",
      "Schezwan Rice",
    ],
    "Pizza and Pasta": [
      "Veg Pizza",
      "Cheese Pizza",
      "White Sauce Pasta",
      "Red Sauce Pasta",
    ],
    "Burgers and Sandwiches": [
      "Veg Burger",
      "Grilled Sandwich",
      "Club Sandwich",
    ],
    "Snacks and Chaat": ["Pani Puri", "Bhel", "Dahi Puri", "Sev Puri"],
    Momos: ["Steamed", "Fried", "Tandoori"],
    Accompaniments: ["Raita", "Salad", "Papad"],
    Desserts: ["Gulab Jamun", "Rasgulla", "Ice Cream", "Halwa"],
    "Drinks (Beverages)": ["Juice", "Cold Drink", "Shakes", "Mocktails"],
  };

  const handleSelect = (value, categoryName) => {
    if (!value || value === "") {
      setSubCategory((prev) =>
        prev.filter((sub) => !groupedSubcategories[categoryName].includes(sub))
      );
    } else {
      setSubCategory((prev) => [
        ...new Set([
          ...prev.filter(
            (sub) => !groupedSubcategories[categoryName].includes(sub)
          ),
          value,
        ]),
      ]);
    }
  };

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-gray-700 mb-2">Categories</p>
      <div className="flex flex-col gap-4">
        {Object.entries(groupedSubcategories).map(([category, subs]) => (
          <div key={category}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {category}
            </label>
            <select
              value={subs.find((sub) => subCategory.includes(sub)) || ""}
              onChange={(e) => handleSelect(e.target.value, category)}
              className="w-full border border-gray-300 px-2 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select Subcategory</option>
              {subs.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

const PriceRange = ({ min, max, setMin, setMax }) => (
  <div className="mb-6 w-full">
    <p className="text-sm font-semibold text-gray-700 mb-2">Price Range</p>

    <div className="flex gap-3 text-sm w-full flex-wrap">
      {/* Min Price Input */}
      <div className="relative w-[45%] min-w-[120px]">
        <span className="absolute left-3 top-2 text-gray-400">₹</span>
        <input
          type="number"
          value={min}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMin(val >= 0 ? val : 0);
          }}
          placeholder="Min"
          className="pl-6 pr-2 py-1 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Max Price Input */}
      <div className="relative w-[45%] min-w-[120px]">
        <span className="absolute left-3 top-2 text-gray-400">₹</span>
        <input
          type="number"
          value={max === Infinity ? "" : max}
          onChange={(e) => {
            const val = e.target.value;
            setMax(val === "" ? Infinity : Number(val));
          }}
          placeholder="Max"
          className="pl-6 pr-2 py-1 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>
    </div>

    {/* Live Preview */}
    <p className="text-xs text-gray-500 mt-2">
      Selected: ₹{min || 0} –{" "}
      {max === Infinity || !max ? "Unlimited" : `₹${max}`}
    </p>
  </div>
);


const Availability = ({ value, setValue }) => (
  <div className="mb-6">
    <p className="text-sm font-semibold text-gray-700 mb-2">Availability</p>
    <div className="flex flex-col text-sm text-gray-700 gap-1">
      {[
        { label: "In Stock", val: "in" },
        { label: "Out of Stock", val: "out" },
      ].map(({ label, val }) => (
        <label key={val} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value === val}
            onChange={() => setValue((prev) => (prev === val ? "" : val))}
            className="accent-purple-600"
          />
          {label}
        </label>
      ))}
    </div>
  </div>
);

const RatingSelector = ({ rating, setRating }) => (
  <div className="mb-9 pt-2 py-20">
    <p className="text-sm font-semibold text-gray-700 mb-2">Rating</p>
    <p className="text-xs text-gray-500 mb-2 italic">
      {rating ? `Rated ${rating} ★ & above` : "All ratings"}
    </p>
    <div className="flex flex-col gap-2 text-sm">
      {[5, 4, 3, 2, 1].map((star) => (
        <label key={star} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rating === star}
            onChange={() => setRating((prev) => (prev === star ? null : star))}
            className="accent-yellow-500"
          />
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < star ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}{" "}
            & Up
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default Collection;
