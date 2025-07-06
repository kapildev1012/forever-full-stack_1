import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="py-16 px-6 bg-white text-gray-700">
      <div className="flex flex-col sm:flex-row justify-center gap-10 text-center max-w-5xl mx-auto">
        {/* Exchange Policy */}
        <div className="flex-1">
          <img
            src={assets.exchange_icon}
            alt="Exchange Policy"
            className="w-6 h-6 mx-auto mb-4"
          />
          <p className="font-semibold text-sm sm:text-base mb-1">
            Easy Exchange Policy
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            We offer hassle-free exchange policy.
          </p>
        </div>

        {/* Return Policy */}
        <div className="flex-1">
          <img
            src={assets.quality_icon}
            alt="Return Policy"
            className="w-6 h-6 mx-auto mb-4"
          />
          <p className="font-semibold text-sm sm:text-base mb-1">
            7 Days Return Policy
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            We provide 7-day free return policy.
          </p>
        </div>

        {/* Customer Support */}
        <div className="flex-1">
          <img
            src={assets.support_img}
            alt="Customer Support"
            className="w-6 h-6 mx-auto mb-4"
          />
          <p className="font-semibold text-sm sm:text-base mb-1">
            Best Customer Support
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            We provide 24/7 customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
