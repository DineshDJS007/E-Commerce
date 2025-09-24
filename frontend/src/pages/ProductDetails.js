import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, cart, setCart } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const BASE_URL = "http://localhost:9000";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Product not found");
        let imgUrl = data.image;
        if (!imgUrl) imgUrl = "https://via.placeholder.com/400x400?text=No+Image";
        else if (!imgUrl.startsWith("http")) imgUrl = `${BASE_URL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
        setProduct({ ...data, id: data._id, image: imgUrl });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      setMsg("");
      setError("");
      if (!user) {
        setError("You must be logged in to add a product to the cart.");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) setError("You must be logged in to add a product to the cart.");
        else throw new Error(data.message || "Failed to add to cart");
        return;
      }

      setMsg("Added to cart");
      // Update cart in context
      setCart([...cart, { ...product, quantity: 1 }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      setMsg("");
      setError("");
      if (!user) {
        setError("You must be logged in to buy a product.");
        return;
      }
      navigate("/address", { state: { product: { ...product, qty: 1 } } });
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error && !product) return <div className="alert alert-warning text-center">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mt-4 product-details">
      <div className="row g-4">
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            onError={(e) => (e.target.src = "https://via.placeholder.com/400x400?text=No+Image")}
          />
        </div>
        <div className="col-md-7">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted mb-1"><strong>Category:</strong> {product.category}</p>
          <h3 className="text-primary mb-3">₹{product.price}</h3>
          <p className="mb-4">{product.description || "No additional description available."}</p>
          {msg && <div className="alert alert-success py-2">{msg}</div>}
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="d-flex gap-2">
            <button className="btn btn-success w-50" onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding…" : "🛒 Add to Cart"}
            </button>
            <button className="btn btn-primary w-50" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
