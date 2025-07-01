import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    payment: "",
    search: "",
    orderId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState("");
  const billRefs = useRef({});

  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        const sortedByDateAsc = data.orders.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const ordersWithIds = sortedByDateAsc.map((order, index) => ({
          ...order,
          numericId: index + 1, // Oldest gets ID 1
        }));
        const sortedNewestFirst = [...ordersWithIds].reverse(); // Newest shows first
        setOrders(sortedNewestFirst);
        setFilteredOrders(sortedNewestFirst);
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // ✅ Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 1000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    let updated = [...orders];
    const { date, status, payment, search, orderId } = filters;
    if (date)
      updated = updated.filter(
        (o) => new Date(o.date).toISOString().split("T")[0] === date
      );
    if (status) updated = updated.filter((o) => o.status === status);
    if (payment)
      updated = updated.filter((o) =>
        payment === "Paid" ? o.payment : !o.payment
      );
    if (search)
      updated = updated.filter(
        (o) =>
          o.address.firstName.toLowerCase().includes(search.toLowerCase()) ||
          o.address.lastName.toLowerCase().includes(search.toLowerCase()) ||
          o.address.phone.includes(search)
      );
    if (orderId)
      updated = updated.filter((o) => String(o.numericId).includes(orderId));
    setFilteredOrders(updated);
  }, [filters, orders]);

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setStatusUpdating(orderId);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success("Status updated successfully");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatusUpdating("");
    }
  };

  const downloadBill = async (orderId) => {
    const input = billRefs.current[orderId];
    if (!input) return;

    // Wait briefly to ensure DOM is fully rendered
    await new Promise((res) => setTimeout(res, 200));

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };

    const pdfWidth = 300;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Get order details for filename
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    // Format name: no space
    const name = `${order.address.firstName}${order.address.lastName}`.replace(
      /\s+/g,
      ""
    );

    // Format date and time safely for filenames
    const dateObj = new Date(order.date);
    const rawDate = dateObj.toLocaleDateString("en-IN"); // 28/06/2025
    const rawTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // e.g., 11:30 AM

    // Replace restricted characters for filename safety
    const safeDate = rawDate.replace(/\//g, "/"); // → 28-06-2025
    const safeTime = rawTime.replace("-", ":").replace(/\s/g, ":"); // → 11-30AM

    // Create final filename
    const fileName = `Order${order.numericId}_${name}_${safeDate}_${safeTime}.pdf`;

    // Save PDF
    pdf.save(fileName);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800";
      case "Packing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Out for delivery":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserAvatar = (name) => {
    return name.toLowerCase().startsWith("mr")
      ? "https://randomuser.me/api/portraits/women/1.jpg"
      : "https://randomuser.me/api/portraits/women/1.jpg";
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-blue-800">
          📦 Orders Dashboard
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border px-2 py-1 rounded shadow-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border px-2 py-1 rounded shadow-sm"
          >
            <option value="">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          <input
            type="text"
            placeholder="Search name/phone"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border px-2 py-1 rounded shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        {currentOrders.map((order, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <img
                  src={getUserAvatar(order.address.firstName)}
                  className="rounded-full w-10 h-10"
                  alt="Avatar"
                />
                <div>
                  <p className="font-semibold text-lg text-blue-900">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.address.email}</p>
                  <p className="text-sm text-gray-500">{order.address.phone}</p>
                  <p className="text-sm text-gray-400">
                    Order ID: #{order.numericId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadBill(order._id)}
                className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <FaDownload /> Download Bill
              </button>
            </div>

            {/* Order Items */}
            <div className="max-h-32 overflow-y-auto border-t border-b py-3 mt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.image || "https://via.placeholder.com/40"}
                      className="w-10 h-10 rounded"
                      alt="Product"
                    />
                    <div className="text-sm">
                      <p>
                        {item.name} x {item.quantity} ({item.size})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {/* Column 1 */}
              <div className="text-sm text-gray-600 space-y-1">
                <p> Items: {order.items.length}</p>
                <p> Payment: {order.payment ? "Done" : "Pending"}</p>
                <p> Source: Web</p>
              </div>

              {/* Column 2 */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  {order.address.city}, {order.address.country}
                </p>
                <p>Ordered: {new Date(order.date).toLocaleString("en-IN")}</p>
                <p>
                  ETD:{" "}
                  {new Date(
                    new Date(order.date).getTime() + 30 * 60 * 1000
                  ).toLocaleString("en-IN")}
                </p>
                {order.amount < 200 && (
                  <p className="text-red-500 font-medium">Delivery: ₹30</p>
                )}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-2 items-end">
                <p className="font-semibold text-lg text-gray-800">
                  Total: {currency}
                  {order.amount + (order.amount < 200 ? 30 : 0)}
                </p>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  📌 {order.status}
                </span>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="border rounded px-3 py-1 text-sm bg-white"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Hidden Bill for PDF */}
            <div style={{ position: "absolute", left: "-9999px" }}>
              <div
                ref={(el) => (billRefs.current[order._id] = el)}
                style={{
                  backgroundColor: "white",
                  padding: "16px",
                  width: "280px",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "11.5px",
                  color: "#000",
                  lineHeight: "2.6",
                  textAlign: "left",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <img
                    src="/logo.png"
                    alt="zippin"
                    width="50"
                    style={{ marginBottom: "6px" }}
                  />
                  <p
                    style={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: "12px",
                    }}
                  >
                    ZIPPIN PRIVATE LIMITED
                  </p>
                  <p>4th Floor, New Excelsior Building</p>
                  <p>Amrit Keshav Marg, Fort, Mumbai - 400001</p>
                  <p>One Horizon Center, Gurgaon - 122002</p>
                  <p
                    style={{
                      borderTop: "1px dashed #000",
                      marginTop: "6px",
                      marginBottom: "6px",
                    }}
                  ></p>
                </div>

                <p>Invoice No : {String(order.numericId).padStart(6, "0")}</p>
                <p>
                  Invoice Date : {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  Invoice Time :{" "}
                  {new Date(order.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>Partner : Zippin Admin</p>
                <p
                  style={{ borderTop: "1px dashed #000", margin: "6px 0" }}
                ></p>

                {/* Header */}
                <p
                  style={{
                    marginBottom: "4px",
                    fontWeight: "bold",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "4px",
                  }}
                >
                  <span style={{ display: "inline-block", width: "130px" }}>
                    Item
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "30px",
                      textAlign: "center",
                    }}
                  >
                    Qty
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "80px",
                      textAlign: "right",
                    }}
                  >
                    Price
                  </span>
                </p>

                {/* Items */}
                {order.items.map((item, i) => (
                  <p
                    key={i}
                    style={{
                      margin: "2px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span style={{ display: "inline-block", width: "130px" }}>
                      {item.name.length > 20
                        ? item.name.slice(0, 20) + "…"
                        : item.name}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "30px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "80px",
                        textAlign: "right",
                      }}
                    >
                      {currency}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                ))}

                <p
                  style={{ borderTop: "1px dashed #000", margin: "8px 0" }}
                ></p>

                {/* Summary */}
                {(() => {
                  const subtotal = order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );
                  const delivery = subtotal < 200 ? 30 : 0;
                  const tax = (subtotal + delivery) * 0.05;
                  const total = subtotal + delivery + tax;

                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Subtotal</span>
                        <span style={{ fontWeight: "bold" }}>
                          {currency}
                          {subtotal.toFixed(2)}
                        </span>
                      </div>

                      {delivery > 0 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Delivery Charges</span>
                          <span style={{ fontWeight: "bold" }}>
                            {currency}
                            {delivery.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>GST (5%)</span>
                        <span style={{ fontWeight: "bold" }}>
                          {currency}
                          {tax.toFixed(2)}
                        </span>
                      </div>

                      <div
                        style={{
                          borderTop: "1px dashed #000",
                          margin: "6px 0",
                          paddingTop: "4px",
                        }}
                      ></div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Net Invoice Amount
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          {currency}
                          {total.toFixed(2)}
                        </span>
                      </div>

                      <div
                        style={{
                          borderTop: "1px dashed #000",
                          margin: "8px 0",
                          paddingTop: "4px",
                        }}
                      ></div>
                      <p
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          marginBottom: "4px",
                        }}
                      >
                        PAYMENT SUMMARY
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Total Payable</span>
                        <span>
                          {currency}
                          {total.toFixed(2)}
                        </span>
                      </div>
                      <div
                        style={{
                          borderTop: "1px dashed #000",
                          margin: "8px 0",
                          paddingTop: "4px",
                        }}
                      ></div>
                      <p
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "11px",
                          letterSpacing: "0.3px",
                        }}
                      >
                        THANK YOU FOR VISITING ZIPPIN
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-4 py-1 rounded border font-medium transition ${
              pageNum === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
