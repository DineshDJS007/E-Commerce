import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const normalizeImage = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    return img.startsWith("http")
      ? img
      : `${process.env.REACT_APP_BACKEND_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/admin`, {
          withCredentials: true,
        });
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const revenue = orders.reduce(
    (sum, o) => sum + ((o.totals && o.totals.total) || 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const outForDeliveryCount = orders.filter((o) => o.status === "Out for Delivery").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/admin/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Unable to update order status");
    }
  };

  const displayedOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="row dashboard-container">
      <div className="col-md-3">
        <AdminSidebar />
      </div>

      <div className="col-md-9">
        <AdminHeader />

        {/* Action Cards in Column */}
        <div className="action-cards-column my-3">
          {[
            { label: "Total Orders", value: orders.length, status: "All" },
            { label: "Pending Orders", value: pendingCount, status: "Pending" },
            { label: "Processing Orders", value: processingCount, status: "Processing" },
            { label: "Shipped Orders", value: shippedCount, status: "Shipped" },
            { label: "Out for Delivery", value: outForDeliveryCount, status: "Out for Delivery" },
            { label: "Delivered Orders", value: deliveredCount, status: "Delivered" },
            { label: "Cancelled Orders", value: cancelledCount, status: "Cancelled" },
            { label: "Revenue", value: `₹${revenue.toFixed(2)}`, status: null },
          ].map((card, idx) => (
            <div
              key={idx}
              className="card stat-card p-3 mb-3"
              onClick={() => card.status && setFilterStatus(card.status)}
              style={{ cursor: card.status ? "pointer" : "default" }}
            >
              <h6>{card.label}</h6>
              <h3>{card.value}</h3>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="mt-4 recent-orders">
          <h5>
            {filterStatus === "All"
              ? "Recent Orders"
              : `${filterStatus} Orders`}
          </h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Username</th>
                  <th>Mobile</th>
                  <th>Delivery Address</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10">Loading…</td>
                  </tr>
                ) : displayedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="10">No orders found.</td>
                  </tr>
                ) : (
                  displayedOrders.slice(0, 10).map((o) => {
                    const username = o.userId?.name || "N/A";
                    const mobile = o.userId?.mobile || "N/A";
                    const paymentMethod = o.paymentMethod || "N/A";
                    const address = o.addressId
                      ? `${o.addressId.name}, ${o.addressId.addressLine1}, ${o.addressId.addressLine2}, ${o.addressId.city}, ${o.addressId.state}, ${o.addressId.pincode}`
                      : "N/A";

                    return (
                      <tr key={o._id}>
                        <td>{o._id}</td>

                        <td>{username}</td>
                        <td>{mobile}</td>

                        <td>{address}</td>
                        <td>
                          {o.items?.length > 0
                            ? o.items.map((p, i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center mb-1"
                              >
                                <img
                                  src={normalizeImage(p.productId?.image)}
                                  alt={p.productId?.name || "Product"}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    marginRight: "5px",
                                  }}
                                />
                                <span>
                                  {p.productId?.name || "N/A"} x {p.quantity || 1}
                                </span>
                              </div>
                            ))
                            : "N/A"}
                        </td>
                        <td>
                          ₹{((o.totals && o.totals.total) || 0).toFixed(2)}
                        </td>
                        <td>{paymentMethod}</td>
                        <td>
                          <span
                            className={`badge ${o.status === "Delivered"
                                ? "bg-success"
                                : o.status === "Pending"
                                  ? "bg-warning text-dark"
                                  : o.status === "Processing"
                                    ? "bg-primary"
                                    : o.status === "Shipped"
                                      ? "bg-info text-dark"
                                      : o.status === "Out for Delivery"
                                        ? "bg-secondary"
                                        : o.status === "Cancelled"
                                          ? "bg-danger"
                                          : "bg-secondary"
                              }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleString()}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(o._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
