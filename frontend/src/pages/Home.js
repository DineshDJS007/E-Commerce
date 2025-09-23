import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCart"; // ✅ fixed import
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "http://localhost:9000/api/products?limit=4",
          { credentials: "include" } // ✅ for session auth
        );

        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();

        // Normalize array safely
        const arr = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        const normalized = arr.map((p) => ({
          ...p,
          id: p._id || p.id,
        }));

        setProducts(normalized);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="home-container my-4">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white p-4 rounded mb-4">
        <h1 className="mb-1">Welcome to DJS-MobiShop</h1>
        <p className="mb-0">Best deals on mobiles, laptops, and accessories.</p>
      </div>

      {/* Featured Products Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Featured Products</h3>
        <Link to="/products" className="btn btn-outline-secondary btn-sm">
          View All
        </Link>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info text-center">
          No featured products available.
        </div>
      ) : (
        <div className="row g-3">
          {products.map((p) => (
            <div className="col-6 col-md-3" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
