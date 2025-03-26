import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Welcome to Zippin , your ultimate online shopping destination for
            everything you need! We are dedicated to providing our customers
            with a seamless and enjoyable shopping experience by offering a wide
            range of high-quality products, from fashion and electronics to home
            goods and beauty essentials. At Zippin, we strive to deliver
            exceptional value, a vast selection, and superior customer service.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>838-456-7890</li>
            <li>zippin@you.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ zippin.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer
