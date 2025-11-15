// server.js — Final Production Version
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import commissionRoutes from "./routes/commissionRoutes.js";
import poolRoutes from "./routes/poolRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import influencerRoutes from "./routes/influencerRoutes.js";
import advertiserRoutes from "./routes/advertiserRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";

const app = express();

/* ----------------------------------------------
 🚀 STEP 1: CORS WHITELIST (IMPORTANT FOR CLOUDLFARE)
----------------------------------------------- */
const allowedOrigins = [
  // Local development
  "http://localhost:3000",
  "https://localhost:3000",
  "http://127.0.0.1:3000",
  "https://127.0.0.1:3000",

  // Cloudflare Pages (your frontend)
  "https://quadata-backend1688.pages.dev",
  "https://quadata.my",

  // Render backend domain
  "https://quadata-backend.onrender.com"
];

// Apply CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, server-side, etc.

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// For preflight OPTIONS requests
app.options("*", cors());

/* ----------------------------------------------
 Middleware
----------------------------------------------- */
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// static file hosting — uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ----------------------------------------------
 Routes
----------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/commission", commissionRoutes);
app.use("/api/pool", poolRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/influencer", influencerRoutes);
app.use("/api/advertiser", advertiserRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/admin", adminRoutes);

/* ----------------------------------------------
 Health Check (Render needs this)
----------------------------------------------- */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || null,
  });
});

/* ----------------------------------------------
 Default 404
----------------------------------------------- */
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

/* ----------------------------------------------
 Global Error Handler
----------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

/* ----------------------------------------------
 Start Server
----------------------------------------------- */
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Quadata backend running on port ${PORT}`);
});
