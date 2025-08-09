import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { FaUserCircle, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-300 border-b border-gray-100">
        <Link to="/" className="transition-transform hover:scale-105">
          <img src={assets.logo} alt="logo" className="w-24 sm:w-32" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden sm:flex items-center gap-6 text-gray-700 text-sm font-medium">
          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink
              key={i}
              to={path}
              className={({ isActive }) =>
                `hover:text-black transition duration-300 ${
                  isActive
                    ? "text-black font-semibold underline underline-offset-4"
                    : ""
                }`
              }
            >
              {path === "/" ? "HOME" : path.slice(1).toUpperCase()}
            </NavLink>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <img src={assets.search_icon} alt="search" className="w-5" />
          </button>

          <Link
            to="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <img src={assets.cart_icon} className="w-5" alt="cart" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-bounce">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() =>
                token ? setDropdownOpen(!dropdownOpen) : navigate("/login")
              }
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:ring-2 ring-gray-300 transition-transform hover:scale-105"
            >
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-4 h-4"
              />
            </button>

            {token && dropdownOpen && (
              <div className="absolute right-3 mt-6 w-80 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] animate-fadeIn p-4">
                <div
                  className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    setDropdownOpen(false);
                  }}
                >
                  My Profile
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    navigate("/orders");
                    setDropdownOpen(false);
                  }}
                >
                  Orders
                </div>
                <div
                  className="px-4 py-2 text-red-500 hover:bg-red-50 transition cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Mobile Fullscreen Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold tracking-wide">Menu</h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <img
                src={assets.dropdown_icon}
                alt="close"
                className="rotate-180 w-4 h-4"
              />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col text-gray-800 text-base font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/collection", label: "Collection" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="py-4 px-6 border-b hover:bg-gray-50 transition"
              >
                {label}
              </NavLink>
            ))}

            {token && (
              <>
                <div className="px-6 text-center pt-5 pb-2 text-s text-gray-900 uppercase tracking-widest font-semibold">
                  Your Account
                </div>

                <NavLink
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-4 px-6 border-b hover:bg-gray-50 transition"
                >
                  <FaUserCircle className="text-gray-600 w-5 h-5" />
                  <span>My Profile</span>
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-4 px-6 border-b hover:bg-gray-50 transition"
                >
                  <FaBoxOpen className="text-gray-600 w-5 h-5" />
                  <span>Orders</span>
                </NavLink>

                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 py-4 px-6 text-left border-b text-red-500 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer */}
      <div className="h-20 sm:h-24"></div>
    </>
  );
};

export default Navbar;
