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
  Sweets: ["Dry Sweets", "Bengali Sweets", "Milk Sweets", "Laddu", "Barfi"],
  Namkeen: ["Sev", "Mixture", "Chakli", "Chivda"],
  Snacks: ["Samosa", "Kachori", "Pakoda"],
  Beverages: ["Lassi", "Chaas", "Milkshake", "Soft Drinks"],
  Bakery: ["Cake", "Pastry", "Cookies", "Toast"],
  Soups: ["Veg Soup", "Tomato Soup", "Manchow Soup", "Sweet Corn Soup"],
  Starters: ["Paneer Tikka", "Veg Platter", "Spring Rolls", "Tandoori Items"],
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
  "Burgers and Sandwiches": ["Veg Burger", "Grilled Sandwich", "Club Sandwich"],
  "Snacks and Chaat": ["Pani Puri", "Bhel", "Dahi Puri", "Sev Puri"],
  Momos: ["Steamed", "Fried", "Tandoori"],
  Accompaniments: ["Raita", "Salad", "Papad"],
  Desserts: ["Gulab Jamun", "Rasgulla", "Ice Cream", "Halwa"],
  "Drinks (Beverages)": ["Juice", "Cold Drink", "Shakes", "Mocktails"],
};


const sizeMap = {
  Sweets: {
    "Dry Sweets": ["100g", "250g", "500g", "1kg"],
    "Bengali Sweets": ["2pcs", "4pcs", "8pcs", "1kg"],
    "Milk Sweets": ["100g", "250g", "500g", "1kg"],
    Laddu: ["2pcs", "4pcs", "8pcs", "1kg"],
    Barfi: ["100g", "250g", "500g", "1kg"],
  },
  Namkeen: {
    Sev: ["100g", "250g", "500g", "1kg"],
    Mixture: ["100g", "250g", "500g", "1kg"],
    Chakli: ["2pcs", "4pcs", "8pcs", "1kg"],
    Chivda: ["100g", "250g", "500g", "1kg"],
  },
  Snacks: {
    Samosa: ["1pc", "2pcs", "4pcs", "8pcs"],
    Kachori: ["1pc", "2pcs", "4pcs"],
    Pakoda: ["100g", "250g", "500g"],
  },
  Beverages: {
    Lassi: ["250ml", "500ml", "1L"],
    Chaas: ["250ml", "500ml", "1L"],
    Milkshake: ["250ml", "500ml", "1L"],
    "Soft Drinks": ["200ml", "500ml", "1L", "2L"],
  },
  Bakery: {
    Cake: ["0.5kg", "1kg", "2kg"],
    Pastry: ["1pc", "2pcs", "4pcs"],
    Cookies: ["100g", "250g", "500g"],
    Toast: ["100g", "250g", "500g"],
  },
  Soups: {
    "Veg Soup": ["Half", "Full"],
    "Tomato Soup": ["Half", "Full"],
    "Manchow Soup": ["Half", "Full"],
    "Sweet Corn Soup": ["Half", "Full"],
  },
  Starters: {
    "Paneer Tikka": ["Half", "Full"],
    "Veg Platter": ["1 Plate", "2 Plate"],
    "Spring Rolls": ["4pcs", "8pcs"],
    "Tandoori Items": ["Half", "Full"],
  },
  "Main Course": {
    Paneer: ["Half", "Full"],
    Dal: ["Half", "Full"],
    "Veg Curries": ["Half", "Full"],
    Kofta: ["Half", "Full"],
    Thali: ["Mini", "Regular", "Deluxe"],
  },
  Breads: {
    Roti: ["1pc", "2pcs", "4pcs"],
    Naan: ["1pc", "2pcs"],
    Paratha: ["1pc", "2pcs"],
    Kulcha: ["1pc", "2pcs"],
  },
  "Rice and Biryani": {
    "Veg Biryani": ["Half", "Full"],
    "Jeera Rice": ["Half", "Full"],
    "Plain Rice": ["Half", "Full"],
    Pulao: ["Half", "Full"],
  },
  "South Indian": {
    Dosa: ["Plain", "Masala", "Cheese"],
    Idli: ["2pcs", "4pcs", "6pcs"],
    Vada: ["2pcs", "4pcs"],
    Uttapam: ["Plain", "Veg", "Cheese"],
  },
  Chinese: {
    Manchurian: ["Half", "Full"],
    Chowmein: ["Half", "Full"],
    "Chilli Paneer": ["Half", "Full"],
  },
  "Fried Rice and Noodles": {
    "Veg Fried Rice": ["Half", "Full"],
    "Hakka Noodles": ["Half", "Full"],
    "Schezwan Rice": ["Half", "Full"],
  },
  "Pizza and Pasta": {
    "Veg Pizza": ["Regular", "Medium", "Large"],
    "Cheese Pizza": ["Regular", "Medium", "Large"],
    "White Sauce Pasta": ["Half", "Full"],
    "Red Sauce Pasta": ["Half", "Full"],
  },
  "Burgers and Sandwiches": {
    "Veg Burger": ["Single", "Combo"],
    "Grilled Sandwich": ["Single", "Combo"],
    "Club Sandwich": ["Single", "Combo"],
  },
  "Snacks and Chaat": {
    "Pani Puri": ["1 Plate", "2 Plate"],
    Bhel: ["Half", "Full"],
    "Dahi Puri": ["1 Plate"],
    "Sev Puri": ["1 Plate"],
  },
  Momos: {
    Steamed: ["6pcs", "8pcs", "12pcs"],
    Fried: ["6pcs", "8pcs", "12pcs"],
    Tandoori: ["6pcs", "8pcs", "12pcs"],
  },
  Accompaniments: {
    Raita: ["Small", "Medium", "Large"],
    Salad: ["Small", "Medium", "Large"],
    Papad: ["1pc", "2pcs", "4pcs"],
  },
  Desserts: {
    "Gulab Jamun": ["1pc", "2pcs", "4pcs"],
    Rasgulla: ["1pc", "2pcs", "4pcs"],
    "Ice Cream": ["Small", "Medium", "Large"],
    Halwa: ["100g", "250g", "500g"],
  },
  "Drinks (Beverages)": {
    Juice: ["250ml", "500ml", "1L"],
    "Cold Drink": ["250ml", "500ml", "1L", "2L"],
    Shakes: ["250ml", "500ml"],
    Mocktails: ["Glass", "Jug"],
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
