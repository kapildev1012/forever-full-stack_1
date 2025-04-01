import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // Toggle selected category
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Toggle selected subcategory
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Apply filters based on search, category, and subcategory
  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
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

    setFilterProducts(filtered);
  };

  // Sort products based on price
  const sortProduct = () => {
    setFilterProducts((prev) => {
      let sorted = [...prev];

      if (sortType === "low-high") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortType === "high-low") {
        sorted.sort((a, b) => b.price - a.price);
      }

      return sorted;
    });
  };

  // Run filtering when dependencies change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  // Run sorting when sort type changes
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt="Dropdown"
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-1 text-sm font-light text-gray-700">
            {[
              "Fashion",
              "Electronics",
              "Appliances",
              "Grocery",
              "Sports, Books & More",
              "Home & Furniture",
            ].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-1 text-sm font-light text-gray-700">
            {[
              "Mobiles",
              "Laptops & Computers",
              "Televisions",
              "Air Conditioners",
              "Men’s Clothing",
              "Women’s Clothing",
              "Jewelry & Accessories",
              "Skincare",
              "Home Decor",
              "Books",
              "Toys & Games",
              "Dairy & Bakery",
              "Snacks & Packaged Food",
            ].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  className="w-3"
                  type="checkbox"
                  value={type}
                  onChange={toggleSubCategory}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Product Sorting Dropdown */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Display Filtered Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
