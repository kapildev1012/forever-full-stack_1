import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaSortAmountDown,
  FaTrash,
  FaStar,
  FaCheck,
  FaTimes,
  FaPlus,
  FaFileExport,
  FaPen,
  FaEye,
} from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-gray-800">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <MdOutlineInventory className="text-indigo-600 text-4xl" /> Product
          Inventory
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm flex items-center gap-2"
          >
            <FaSortAmountDown /> Sort
          </button>

          <button
            onClick={fetchList}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm flex items-center gap-2"
          >
            <FaPlus /> Refresh
          </button>

          <CSVLink
            data={filteredList}
            filename="product_inventory.csv"
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 text-sm flex items-center gap-2"
          >
            <FaFileExport /> Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredList.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 border hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                className="w-20 h-20 rounded-lg object-cover border"
                src={item.image?.[0] || "https://via.placeholder.com/80"}
                alt={item.name}
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.category} / {item.subCategory}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold text-gray-600">Price:</span>{" "}
                {currency}
                {item.price}
              </p>
              <p>
                <span className="font-semibold text-gray-600">Sizes:</span>{" "}
                {Array.isArray(item.sizes)
                  ? item.sizes.join(", ")
                  : typeof item.sizes === "object"
                  ? Object.entries(item.sizes)
                      .map(([size, price]) => `${size} (${currency}${price})`)
                      .join(", ")
                  : "—"}
              </p>
              <p className="flex items-center gap-1">
                <span className="font-semibold text-gray-600">Bestseller:</span>{" "}
                {item.bestseller ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </p>
              <p>
                <span className="font-semibold text-gray-600">Added:</span>{" "}
                {new Date(item.date).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-1">
                <span className="font-semibold text-gray-600">Stock:</span>
                {item.inStock !== false ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <FaCheck /> Available
                  </span>
                ) : (
                  <span className="text-red-500 font-medium flex items-center gap-1">
                    <FaTimes /> Out of Stock
                  </span>
                )}
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => removeProduct(item._id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
