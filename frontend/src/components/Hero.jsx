import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  const handleNavigateToCollection = () => {
    navigate("/collection");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start with opacity 0
      animate={{ opacity: 1 }} // Fade in to full opacity
      transition={{ duration: 1.5 }} // 1.5 second fade-in duration
      className="relative flex flex-col sm:flex-row items-center sm:items-start bg-gradient-to-r from-purple-800 via-pink-800 to-red-700 text-white shadow-lg overflow-hidden"
    >
      {/* Hero Left Side */}
      <motion.div
        initial={{ x: -50 }} // Start off-screen to the left
        animate={{ x: 10 }} // Animate to position 0 (center)
        transition={{ duration: 2, type: "spring", stiffness: 100 }} // Spring animation with some bounce
        className="w-full sm:w-1/2 px-6 py-14 sm:py-24 flex flex-col items-center sm:items-start"
      >
        <div className="mb-6 flex items-center gap-3 justify-center sm:justify-start">
          <p className="w-12 h-[2px] bg-white"></p>
          <p className="font-medium text-sm uppercase tracking-wide">
            Welcome to ZIPPIN
          </p>
        </div>
        <h1 className="text-4xl sm:text-4xl lg:text-6xl font-semibold leading-tight text-center sm:text-left mb-6">
          Discover the Latest Arrivals
        </h1>
        <div className="flex items-center gap-2 justify-center sm:justify-start mb-6">
          <p className="font-semibold text-lg sm:text-xl">Shop Now</p>
          <p className="w-10 h-[1px] bg-white"></p>
        </div>
        {/* Call-to-Action Button */}
        <motion.button
          onClick={handleNavigateToCollection}
          whileHover={{ scale: 1.05 }} // Slightly increase size on hover
          whileTap={{ scale: 1}} // Slightly decrease size on tap
          className="bg-white text-black py-3 px-10 rounded-xl shadow-lg transform transition-all hover:bg-gray-200 focus:outline-none"
        >
          Explore Collection
        </motion.button>
      </motion.div>

      {/* Hero Right Side */}
      <motion.div
        initial={{ opacity: 0.7 }} // Start with opacity 0
        animate={{ opacity: 1 }} // Fade in to full opacity
        transition={{ duration: 1 }} // 1.5 second fade-in duration
        className="w-full sm:w-1/2 relative overflow-hidden"
      >
        <img
          className="w-full h-full object-cover"
          src={assets.hero_img}
          alt="Hero"
        />
        {/* Subtle Overlay for Better Visibility */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
