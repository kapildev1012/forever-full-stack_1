import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-5 md:p-10 bg-gray-50 min-h-screen">
      <h3 className="text-xl font-bold mb-5 text-gray-700">Order Page</h3>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-gray-300 p-6 bg-white shadow-md rounded-lg"
            key={index}
          >
            <img className="w-16" src={assets.parcel_icon} alt="Parcel" />
            <div>
              {order.items.map((item, index) => (
                <p className="py-0.5" key={index}>
                  {item.name} x {item.quantity} <span>{item.size}</span>
                </p>
              ))}
              <p className="mt-3 mb-1 font-medium text-gray-800">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="text-gray-600">
                {order.address.street}, {order.address.city}
              </p>
              <p className="text-gray-600">
                {order.address.state}, {order.address.country},{" "}
                {order.address.zipcode}
              </p>
              <p className="font-semibold text-gray-800">
                Phone: {order.address.phone}
              </p>
            </div>
            <div className="text-gray-700">
              <p className="text-base">Items: {order.items.length}</p>
              <p className="mt-2">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p className="font-semibold">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
              <p className="font-semibold">
                Time: {new Date(order.date).toLocaleTimeString()}
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 font-semibold text-gray-700"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
