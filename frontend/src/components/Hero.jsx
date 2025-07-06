import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const heroImages = [assets.hero_img, assets.hero_img2, assets.hero_img3];

const Hero = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = () => {
    navigate("/collection");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative w-full py-10 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden bg-black rounded-3xl text-white"
    >
      {/* Background Glow */}
      <div className="absolute w-[300px] h-[300px] bg-green-400 blur-[100px] opacity-20 rounded-full -top-10 -left-20 z-0" />
      <div className="absolute w-[250px] h-[250px] bg-blue-500 blur-[100px] opacity-20 rounded-full bottom-0 right-0 z-0" />

      {/* Hero Layout */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between w-full px-4 sm:px-6 md:px-12 gap-8 max-w-[1200px]">
        {/* Text Section */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <p className="text-green-400 text-xs uppercase tracking-wider mb-3">
            ZIPPIN EXCLUSIVE
          </p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text drop-shadow-md">
            Step Into the Future of Fashion
          </h1>

          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md mx-auto md:mx-0">
            Next-gen fashion meets smart transitions. Minimal design. Mobile
            optimized.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigate}
            className="px-5 py-2.5 text-sm bg-gradient-to-br from-green-700 to-green-500 text-black font-semibold rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition-all"
          >
            Explore Collection
          </motion.button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          key={currentImageIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative w-full max-w-[300px] h-[250px] sm:h-[220px] md:h-[180px] overflow-hidden rounded-2xl shadow-xl border border-white/10"
          >
            <img
              src={heroImages[currentImageIndex]}
              alt={`Hero ${currentImageIndex}`}
              className="w-full h-full object-cover object-center rounded-2xl transition-all duration-1000 ease-in-out scale-105 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;

