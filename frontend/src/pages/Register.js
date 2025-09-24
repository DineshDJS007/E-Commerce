import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Include toast CSS

export default function Register({ embedded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: "" }
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); // hide after 3.5s
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      showToast("Mobile number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      showToast("Registration successful!", "success");

      setTimeout(() => {
        nav("/login"); // Redirect after toast
      }, 1500);
    } catch (e) {
      showToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`register-page ${
        embedded ? "" : "d-flex justify-content-center align-items-center"
      }`}
    >
      <div className={embedded ? "" : "col-md-6"}>
        <div className="card p-4 shadow-sm">
          {!embedded && <h4 className="text-center mb-4">Create Account</h4>}

          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              required
            />

            <button className="btn btn-success w-100 py-2" disabled={loading}>
              {loading ? "Creating…" : "Register"}
            </button>
          </form>
        </div>
      </div>

      {/* Toast container */}
      {toast && (
        <div className="toast-container">
          <div
            className="toast"
            style={{ backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545" }}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
