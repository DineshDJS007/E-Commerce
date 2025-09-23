import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy credentials
    const dummyEmail = "admin@gmail.com";
    const dummyPassword = "admin123";

    if (email === dummyEmail && password === dummyPassword) {
      // Set admin user in AppContent state
      setUser({ name: "Admin User", email: dummyEmail });
      // Navigate to dashboard
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-page d-flex justify-content-center align-items-center vh-100">
      <form
        className="admin-login-form p-4 shadow rounded"
        onSubmit={handleLogin}
      >
        <h3 className="mb-4 text-center">Admin Login</h3>

        {error && <p className="text-danger">{error}</p>}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
