import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";
import { motion } from "framer-motion";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10)); // latest 10 products
  }, [products]);

  return (
    <div id="collection" className="my-10 px-4 sm:px-6 lg:px-16">
      <div className="text-center mb-8">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-full sm:w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600 mt-2">
          All items below are{" "}
          <span className="text-green-600 font-semibold">Fresh</span>, delivered
          instantly, and picked from our exclusive new arrivals. Get the best
          picks in fashion, tech, home, and more!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {latestProducts.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 10,
              bounce: 0.3,
            }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl bg-white border border-gray-100 transform transition-all duration-700 ease-in-out hover:scale-[1.05] hover:brightness-105 hover:border-blue-300"
          >
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              rating={item.rating || 0}
              subCategory={item.subCategory || "Uncategorized"}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
