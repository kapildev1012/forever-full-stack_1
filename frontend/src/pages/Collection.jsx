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

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
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
    category,
    subCategory,
    minPrice,
    maxPrice,
    availability,
    rating,
    sortType,
  ]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 pt-1 border-t bg-gray-90 min-h-screen px-4 relative overflow-x-hidden">
      {/* Overlay behind filter panel */}
      {showFilter && (
        <div
          className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={() => setShowFilter(false)}
        />
      )}

      {/* Mobile filter toggle and reset */}
      <div className="block sm:hidden flex items-center justify-between gap-3 mt-4 mb-5 px-1 z-10">
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 via-gray-900 to-red-700 text-white text-base font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          <motion.span
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="text-white"
          >
            <FaSlidersH />
          </motion.span>
          Show Filters
        </button>

        <button
          onClick={clearFilters}
          aria-label="Reset all filters"
          className="xflex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 via-gray-900 to-red-700 text-white text-base font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          {/* Background animation */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-700 via-gray-900 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
          <span className="absolute inset-0 w-full h-full bg-gray-00 opacity-0 group-hover:opacity-70 transition-opacity duration-500 rounded-full"></span>

          {/* Button content */}
          <span className="relative z-10 flex items-center gap-2">
            <FiRotateCcw className="text-base" />
            Reset Filters
          </span>

          {/* Glow ring */}
          <span className="absolute inset-0 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition duration-500 animate-pulse"></span>
        </button>
      </div>

      {/* Filter Sidebar */}
      <aside
        className={`bg-white shadow-md p-5 rounded-lg transition-all duration-300
        ${
          showFilter
            ? "fixed top-16 left-0 w-4/5 h-[calc(100%-4rem)] overflow-y-auto z-50"
            : "hidden sm:block sm:w-64"
        } sm:static sm:z-auto`}
      >
        <div className="flex justify-between items-center sm:hidden mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            onClick={() => setShowFilter(false)}
            className="text-red-500 text-sm font-semibold"
          >
            ✕ Close
          </button>
        </div>

        <div className="hidden sm:flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:underline"
          >
            Clear All
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

      {/* Product Grid */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <Title text1="ALL" text2="COLLECTIONS" />
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <strong>{filterProducts.length}</strong> products
            </p>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border border-gray-500 px-3 py-1.5 rounded text-sm shadow-sm"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Low to High</option>
              <option value="high-low">High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <p className="text-center col-span-full text-gray-500">
              No products found
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

// Filters
const SubCategoryFilter = ({ subCategory, setSubCategory }) => {
  const groupedSubcategories = {
    "Beauty & Personal Care": [
      "Skin Care",
      "Hair Care",
      "Makeup",
      "Fragrances",
      "Bath & Body",
      "Men's Grooming",
    ],
    Fashion: [
      "Men's Clothing",
      "Women's Clothing",
      "Footwear",
      "Accessories",
      "Bags & Wallets",
    ],
    Electronics: [
      "Mobile Phones",
      "Laptops & Accessories",
      "Audio Devices",
      "Smart Wearables",
      "Cameras",
    ],
    Appliances: [
      "Kitchen Appliances",
      "Home Appliances",
      "Personal Care Appliances",
      "Large Appliances",
    ],
    Grocery: [
      "Dairy & Eggs",
      "Beverages",
      "Snacks & Instant Food",
      "Staples",
      "Spices & Condiments",
    ],
    "Sports, Books & More": ["Sports Equipment", "Fitness & Gym", "Books"],
    "Home & Furniture": [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Lighting",
    ],
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
      <p className="text-m font-semibold text-purple-800 mb-5">Categories</p>
      <div className="flex flex-col gap-4">
        {Object.entries(groupedSubcategories).map(([category, subs]) => (
          <div key={category} className="relative z-10">
            <label className="text-sm font-medium text-gray-800 mb-2 block">
              {category}
            </label>
            <select
              value={subs.find((sub) => subCategory.includes(sub)) || ""}
              onChange={(e) => handleSelect(e.target.value, category)}
              className="w-full border border-gray-300 px-2 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-m"
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
  <div className="mb-8">
    <p className="text-md font-semibold text-purple-800 mb-3">Price Range</p>
    <div className="flex gap-4 text-sm">
      <input
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value) || "")}
        placeholder="Min"
        className="border border-gray-300 px-2 py-1 w-24 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="number"
        value={max}
        onChange={(e) => setMax(Number(e.target.value) || 10000)}
        placeholder="Max"
        className="border border-gray-300 px-2 py-1 w-24 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  </div>
);

const Availability = ({ value, setValue }) => (
  <div className="mb-6">
    <p className="text-md font-semibold text-purple-800 mb-2">Availability</p>
    <div className="flex flex-col text-sm text-gray-700">
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
  <div className="mb-6">
    <p className="text-md font-semibold text-purple-800 mb-1">
  
    </p>
    <p className="text-xs text-gray-500 mb-2 italic">
      {rating
        ? `Showing products rated ${rating}★ & above`
        : "Showing all ratings"}
    </p>
    <div className="flex flex-col gap-1 text-sm text-gray-700">
      {[].map((star) => (
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
            ))}
            & {star} & above
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default Collection;
