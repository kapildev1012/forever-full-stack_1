import React from "react";
import { motion } from "framer-motion";

const owners = [
  {
    name: "Kapil Dev",
    role: "Founder & CEO",
    image: "https://placehold.co/100x100?text=Kapil",
    about:
      "Leads innovation in fitness & e-commerce with a vision for health, performance, and technology integration.",
  },
];

const OurPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 text-gray-800 py-10 px-4 sm:px-2 lg:px-24">
      <div className="max-w-5xl mx-auto text-center mb-6">
        <h2 className="text-4xl font-extrabold text-green-700 mb-3">
          Meet Our Founder
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          The driving force behind our mission to empower fitness, wellness, and
          accessibility through cutting-edge e-commerce solutions.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {owners.map((owner, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img
                  src={owner.image}
                  alt={owner.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-200 shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>

              <p className="text-xl font-bold text-gray-900 mt-3">
                {owner.name}
              </p>
              <p className="text-sm text-green-600 font-medium mb-2">
                {owner.role}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                {owner.about}
              </p>

              <div className="flex gap-4 mt-3 text-gray-400 text-lg">
                <a href="#" className="hover:text-green-500 transition">
                  <i className="fab fa-linkedin-in" />
                </a>
                <a href="#" className="hover:text-green-500 transition">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="hover:text-green-500 transition">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OurPolicy;
