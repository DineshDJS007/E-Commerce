import React from "react";
import "../styles/AdminHeader.css";

export default function AdminHeader({ user }) {
  return (
    <div className="admin-header d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 shadow-sm">
      <h4 className="admin-title mb-2 mb-md-0">Admin Panel</h4>
      <div className="admin-user d-flex align-items-center">
        <div className="admin-avatar me-2">
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
        <span className="admin-email">{user?.email || "Admin"}</span>
      </div>
    </div>
  );
}
