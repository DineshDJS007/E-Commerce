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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL, // must match frontend domain
    credentials: true,    // allow cookies
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
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true, // cookie not accessible via JS
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
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
);
