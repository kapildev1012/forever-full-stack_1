import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProductItem = ({
  id,
  image,
  name,
  price,
  rating = 0,
  subCategory = "",
}) => {
  const { currency } = useContext(ShopContext);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(generateRandomTime());

  const originalPrice = Math.round(price / 0.8);

  function generateRandomTime() {
    const min = 2 * 60 * 60;
    const max = 24 * 60 * 60;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? generateRandomTime() : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (24 * 3600));
    const h = Math.floor((seconds % (24 * 3600)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d > 0 ? `${d}d ` : ""}${h}h ${m}m ${s}s`;
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${id}`} className="block">
        {/* Image Section */}
        <div className="relative w-full aspect-[1/1] bg-gray-100 overflow-hidden">
          <img
            src={image[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {image[1] && (
            <img
              src={image[1]}
              alt="hover-preview"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-300"
            />
          )}

          {/* Wishlist */}
          <div className="absolute top-2 right-2 z-10">
            <button
              title="Wishlist"
              onClick={(e) => {
                e.preventDefault();
                setWishlisted(!wishlisted);
              }}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              {wishlisted ? (
                <FaHeart className="text-red-500" size={18} />
              ) : (
                <FaRegHeart size={18} />
              )}
            </button>
          </div>

          {/* In Stock Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-green-600 text-white text-[11px] px-2 py-1 rounded-full shadow-sm">
              In Stock
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-3 sm:p-4 mt-3">
          <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 min-h-[25px]">
            {name}
          </p>
          <p className="text-[11px] text-red-500 whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">
            Offer ends in {formatTime(timeLeft)}
          </p>
          {subCategory && (
            <p className="text-xs text-gray-500 mt-1">{subCategory}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <p className="text-[15px] font-bold text-gray-800">
              {currency}
              {price}
            </p>
            <p className="text-[12px] text-gray-400 line-through">
              {currency}
              {originalPrice}
            </p>
            <span className="bg-red-100 text-red-600 text-[9px] font-semibold px-2 py-1 rounded-full hover:bg-red-200 transition-all">
              20% OFF
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">Delivery in 30 mins</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
