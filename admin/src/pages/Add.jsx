import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [sizes, setSizes] = useState([]);

  const categoryMap = {
    "Beauty & Personal Care": [
      "Skin Care",
      "Hair Care",
      "Makeup",
      "Fragrances",
      "Bath & Body",
      "Men's Grooming",
    ],
    Fashion: ["Men's Clothing", "Footwear"],
    Electronics: ["Mobile Phones", "Laptops", "Accessories"],
    Appliances: ["Washing Machines", "Refrigerators", "Microwaves"],
    Grocery: ["Fruits", "Vegetables", "Snacks"],
    "Sports, Books & More": ["Books", "Fitness Equipment", "Sportswear"],
    "Home & Furniture": ["Furniture", "Home Decor", "Kitchen Essentials"],
  };

  const sizeMap = {
    Fashion: {
      "Men's Clothing": ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
      Footwear: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
    },
    Grocery: {
      Fruits: ["500g", "1kg", "2kg"],
      Vegetables: ["500g", "1kg", "2kg"],
      Snacks: ["100g", "250g", "500g", "1kg"],
    },
    Electronics: {
      "Mobile Phones": ["64GB", "128GB", "256GB", "512GB"],
      Laptops: [
        "8GB RAM",
        "16GB RAM",
        "32GB RAM",
        "256GB SSD",
        "512GB SSD",
        "1TB SSD",
      ],
      Accessories: ["Small", "Medium", "Large"],
    },
    Appliances: {
      "Washing Machines": ["6kg", "7kg", "8kg", "10kg"],
      Refrigerators: ["180L", "250L", "350L", "500L"],
      Microwaves: ["20L", "25L", "30L"],
    },
    "Beauty & Personal Care": {
      "Skin Care": ["100ml", "250ml", "500ml"],
      "Hair Care": ["100ml", "250ml", "500ml"],
      Makeup: ["Small", "Medium", "Large"],
      Fragrances: ["30ml", "50ml", "100ml"],
      "Bath & Body": ["250ml", "500ml", "1L"],
      "Men's Grooming": ["100ml", "250ml", "500ml"],
    },
    "Sports, Books & More": {
      Books: ["Paperback", "Hardcover", "E-book"],
      "Fitness Equipment": ["1kg", "2kg", "5kg", "10kg", "20kg"],
      Sportswear: ["S", "M", "L", "XL", "XXL"],
    },
    "Home & Furniture": {
      Furniture: ["Single", "Double", "Queen", "King"],
      "Home Decor": ["Small", "Medium", "Large"],
      "Kitchen Essentials": ["1pc", "3pcs", "5pcs", "10pcs"],
    },
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("inStock", inStock);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setCategory("");
        setSubCategory("");
        setBestseller(false);
        setInStock(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Upload Images */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {[setImage1, setImage2, setImage3, setImage4].map(
            (setImage, index) => (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className="w-20"
                  src={
                    !eval(`image${index + 1}`)
                      ? assets.upload_area
                      : URL.createObjectURL(eval(`image${index + 1}`))
                  }
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            )
          )}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category, Subcategory, Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        {/* Category */}
        <div>
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
              setSizes([]);
            }}
            className="w-full px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categoryMap).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => {
              setSubCategory(e.target.value);
              setSizes([]);
            }}
            className="w-full px-3 py-2"
            disabled={!category}
            required
          >
            <option value="">Select Sub Category</option>
            {category &&
              categoryMap[category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="Enter Price"
            required
          />
        </div>
      </div>

      {/* Sizes */}
      {category &&
        subCategory &&
        sizeMap[category]?.[subCategory]?.length > 0 && (
          <div>
            <p className="mb-2">Product Sizes</p>
            <div className="flex gap-3 flex-wrap">
              {sizeMap[category][subCategory].map((size) => (
                <div
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((item) => item !== size)
                        : [...prev, size]
                    )
                  }
                >
                  <p
                    className={`${
                      sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                    } px-3 py-1 cursor-pointer rounded`}
                  >
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Bestseller & In Stock */}
      <div className="flex gap-6 mt-2 flex-wrap">
        <div className="flex gap-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label htmlFor="bestseller">Add to Bestseller</label>
        </div>

        <div className="flex gap-2">
          <input
            onChange={() => setInStock((prev) => !prev)}
            checked={inStock}
            type="checkbox"
            id="inStock"
          />
          <label htmlFor="inStock">In Stock</label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
