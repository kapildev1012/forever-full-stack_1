import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 px-5 md:px-20 pt-16 pb-10 font-[Inter,sans-serif]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <div>
          <img src={assets.logo} alt="Zippin Logo" className="w-28 mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            Welcome to <strong>Zippin</strong>, your ultimate online shopping
            destination for everything you need! From fashion and electronics to
            home goods and beauty essentials, we deliver value, variety, and
            great service.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Company</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-black transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-black transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/order" className="hover:text-black transition">
                Delivery
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-black transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Get in Touch</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📞 838-456-7890</li>
            <li>📧 zippin@you.com</li>
          </ul>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
        © 2024 Zippin.com — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
