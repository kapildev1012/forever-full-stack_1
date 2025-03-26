import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="bg-gray-100 py-16">
      {/* Cart Title */}
      <div className="text-center mb-4">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Cart Items */}
      <div className="max-w-3xl mx-auto px-4">
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg mb-6 p-6"
              >
                <div className="flex flex-column sm:flex-row items-center gap-6">
                  <img
                    className="w-20 sm:w-24 rounded-md"
                    src={productData.image[0]}
                    alt={productData.name}
                  />
                  <div className="flex-1">
                    <p className="w-10 text-lg sm:text-xl mt-1 font-semibold text-gray-600">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-sm text-gray-500">
                        {currency}
                        {productData.price}
                      </p>
                    
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      onChange={(e) =>
                        e.target.value === "" || e.target.value === "0"
                          ? null
                          : updateQuantity(
                              item._id,
                              item.size,
                              Number(e.target.value)
                            )
                      }
                      className="border px-2 py-2 w-14 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                    />
                    <img
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="w-5 cursor-pointer hover:opacity-75 transition-opacity"
                      src={assets.bin_icon}
                      alt="Remove"
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-lg text-gray-500">
            Your cart is empty
          </p>
        )}
      </div>

      {/* Cart Total & Checkout */}
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex justify-end">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end mt-7">
              <button
                onClick={() => navigate("/place-order")}
                className="bg-black text-white text-sm py-3 px-8 rounded-md hover:bg-gray-800 focus:outline-none transition-all duration-300"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
