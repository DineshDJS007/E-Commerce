import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductCart.css";

function ProductCard({ product }) {

  // Normalize image URL
  const normalizeImage = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${process.env.REACT_APP_BACKEND_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <div className="product-card card h-100">
      {/* Product Image */}
      <div className="product-img-wrapper">
        <img
          src={normalizeImage(product.image)}
          className="card-img-top product-img"
          alt={product.name}
          onError={(e) => (e.target.style.display = "none")} // hide if broken
        />
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>

        {/* Rating Stars */}
        <div className="product-rating">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>
              {i < Math.round(product.rating || 0) ? "★" : "☆"}
            </span>
          ))}
        </div>

        {/* Price */}
        <p className="card-text fw-bold">₹{product.price}</p>

        {/* View Details Button */}
        <Link
          to={`/product/${product._id}`}
          className="btn btn-primary mt-auto w-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
