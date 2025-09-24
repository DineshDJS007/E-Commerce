import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Cart.css";
import { UserContext } from "../contexts/userContext";

export default function Cart() {
  const [items, setItems] = useState([]);
  const { cart, setCart } = useContext(UserContext); // context for cart count
  const BASE_URL = "http://localhost:9000";
  const navigate = useNavigate();

  // Normalize image URL
  const normalizeImage = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  // Load cart items
  const loadCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        withCredentials: true,
      });
      const validItems = res.data.filter(
        (i) => i.productId && typeof i.productId.price === "number"
      );
      setItems(validItems);
      setCart(validItems); // update context cart
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update quantity
  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );

    try {
      await axios.put(
        `${BASE_URL}/api/cart/${id}`,
        { quantity },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      loadCart();
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${id}`, {
        withCredentials: true,
      });
      const updatedItems = items.filter((item) => item._id !== id);
      setItems(updatedItems);
      setCart(updatedItems); // update context cart so header count decreases
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Buy Now
  const handleBuyNow = async (item) => {
    try {
      // Navigate to address page with the selected product
      navigate("/address", {
        state: { product: { ...item.productId, qty: item.quantity } },
      });

      // Remove item from cart immediately
      await axios.delete(`${BASE_URL}/api/cart/${item._id}`, {
        withCredentials: true,
      });

      const updatedItems = items.filter((i) => i._id !== item._id);
      setItems(updatedItems);
      setCart(updatedItems); // Update context for header
    } catch (err) {
      console.error("Error processing Buy Now:", err);
    }
  };

  // Total price
  const totalPrice = items.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );

  if (!items.length)
    return (
      <div className="cart-empty text-center p-5">
        <h4>Your cart is empty</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/products")}
        >
          Shop Now
        </button>
      </div>
    );

  return (
    <div className="container cart-page py-4">
      {items.map((i) => (
        <div
          key={i._id}
          className="cart-item d-flex align-items-center border rounded p-3 mb-3"
        >
          <img
            src={normalizeImage(i.productId.image)}
            alt={i.productId.name}
            className="cart-item-img me-3"
          />
          <div className="flex-grow-1">
            <h6 className="mb-1">{i.productId.name}</h6>
            <p className="mb-1 text-muted">₹{i.productId.price}</p>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => updateQty(i._id, i.quantity - 1)}
              >
                -
              </button>
              <span className="px-2">{i.quantity}</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => updateQty(i._id, i.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="text-end">
            <p className="mb-2 fw-bold">
              ₹{(i.productId.price * i.quantity).toFixed(2)}
            </p>
            <div className="d-flex flex-column gap-1">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleBuyNow(i)}
              >
                Buy Now
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeItem(i._id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="cart-total text-end mt-4">
        <h5>Total: ₹{totalPrice.toFixed(2)}</h5>
      </div>
    </div>
  );
}
