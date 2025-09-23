import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ embedded }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({ message: "", type: "" }); // type: success | error
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setToast({ message: "", type: "" });
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setToast({ message: "Login successful! Redirecting…", type: "success" });

      setTimeout(() => nav("/"), 1500); // Redirect after showing toast
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className={`login-page ${embedded ? "" : "d-flex justify-content-center align-items-center"}`}>
      <div className={embedded ? "" : "col-md-5"}>
        <div className="card shadow p-4">
          {!embedded && <h3>Login</h3>}

          <form className="login-form" onSubmit={submit}>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          {!embedded && (
            <p>
              Don’t have an account?{" "}
              <Link to="/register" className="text-primary">
                Register
              </Link>
            </p>
          )}
        </div>

        {/* Toast */}
        {toast.message && (
          <div className="toast-container">
            <div
              className={`toast ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
              role="alert"
            >
              <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setToast({ message: "", type: "" })}
                ></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
