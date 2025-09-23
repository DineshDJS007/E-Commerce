import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCart";
import "../styles/ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:9000/api/products");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load products");

        const normalized = (data.products || data).map(p => ({ ...p, id: p._id }));
        setProducts(normalized);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filtered = useMemo(() => {
    let out = products;
    if (q) out = out.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat !== "All") out = out.filter((p) => p.category === cat);
    return out;
  }, [products, q, cat]);

  return (
    <div className="product-list-page container py-4">
      {/* Top Filter Bar */}
      <div className="row mb-4 justify-content-center align-items-center g-2 filter-bar">
        <div className="col-md-7">
          <input
            className="form-control"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            {filtered.length === 0 && <p className="text-muted">No products found.</p>}
            {filtered.map((p) => (
              <div className="col-6 col-md-3 mb-3" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
