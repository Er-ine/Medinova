import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from "./models/User.js";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Basic health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "MERN backend is running" });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn("MongoDB URI not found in .env file. Database connection skipped.");
} else {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log("MongoDB connected successfully");
      
      // Seed Admin User
      try {
        const adminEmail = "admin@hospital";
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("admin", salt);
          await User.create({
            name: "Hospital Admin",
            email: adminEmail,
            phone: "0000000000",
            password: hashedPassword,
            role: "admin"
          });
          console.log("Admin account created successfully.");
        }
      } catch (err) {
        console.error("Error seeding admin:", err);
      }
    })
    .catch(err => console.error("MongoDB connection error:", err));
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});