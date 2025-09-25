import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());

// ✅ Serve uploads from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:3000",                       // local dev
  "https://e-commerce-app-yxe1.onrender.com"    // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests (Postman, etc.)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed."));
      }
    },
    credentials: true,
  })
);

// ✅ Trust proxy (needed for secure cookies on Render/Heroku)
app.set("trust proxy", 1);

// ✅ Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Routes
app.use("/api/address", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  )
);
