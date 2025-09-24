import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import DataTable from "./DataTable";
import "../styles/ManageOrders.css";

export default function ManageOrders() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizeImage = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    return img.startsWith("http")
      ? img
      : `${process.env.REACT_APP_BACKEND_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  const load = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders/admin`, {
      credentials: "include",
    });
    const data = await res.json();
    setRows(data);
    setFilteredRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  // Search filter function
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = rows.filter((order) => {
      const orderId = order._id.toLowerCase();
      const name = order.userId?.name?.toLowerCase() || "";
      const email = order.userId?.email?.toLowerCase() || "";
      const products = order.items
        .map((it) => it.productId?.name?.toLowerCase() || "")
        .join(" ");

      return (
        orderId.includes(term) ||
        name.includes(term) ||
        email.includes(term) ||
        products.includes(term)
      );
    });
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const columns = [
    { key: "_id", label: "Order ID" },
    {
      key: "userId",
      label: "Name",
      render: (user) => user?.name || "N/A",
    },
    {
      key: "userId",
      label: "Mobile",
      render: (user) => user?.mobile || "N/A",
    },
    {
      key: "userId",
      label: "Email",
      render: (user) => user?.email || "N/A",
    },
    {
      key: "addressId",
      label: "Address",
      render: (a) =>
        a
          ? `${a.name}, ${a.addressLine1}, ${a.addressLine2}, ${a.city}, ${a.state}, ${a.pincode}`
          : "N/A",
    },
    {
      key: "items",
      label: "Products",
      render: (items) =>
        items?.map((it, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={normalizeImage(it.productId?.image)}
              alt={it.productId?.name || "Product"}
              width={40}
              height={40}
              style={{
                objectFit: "cover",
                marginRight: "8px",
                borderRadius: "4px",
              }}
            />
            <span>
              {it.productId?.name || "N/A"} (x{it.quantity || 1})
            </span>
          </div>
        )) || "N/A",
    },
    {
      key: "totals",
      label: "Amount",
      render: (v) => `₹${(v?.total || 0).toFixed(2)}`,
    },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Date & Time",
      render: (v) => new Date(v).toLocaleString(),
    },
  ];

  return (
    <div className="row manage-orders-container">
      <div className="col-md-3">
        <AdminSidebar />
      </div>
      <div className="col-md-9">
        <AdminHeader />
        <div className="p-3">
          <h4 className="mb-3">Manage Orders</h4>

          {/* Search Bar */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Order ID, Username, Email, or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <DataTable columns={columns} data={filteredRows} />
          </div>
        </div>
      </div>
    </div>
  );
}
