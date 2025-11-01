import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Always point to backend/uploads (relative to backend folder)
const uploadDir = path.join(__dirname, "../uploads");

// ✅ Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
   console.log("📁 Created uploads folder at:", uploadDir);
} else {
  console.log("📁 Using uploads folder at:", uploadDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
      console.log("📸 Saving file to:", path.join(uploadDir, uniqueName));
    cb(null, uniqueName);
  },
});

// ✅ Export upload middleware
export const upload = multer({ storage });
