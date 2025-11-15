// server.js — Final Corrected Version (CORS FIXED)
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
   🚀 STEP 1: FIX CORS (THIS IS THE IMPORTANT PART)
----------------------------------------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://127.0.0.1:3000",
  "https://127.0.0.1:3000",
  process.env.FRONTEND_URL, // optional
  "https://alias-unlike-cabinet-possess.trycloudflare.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser clients (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// allow all OPTIONS preflight
app.options("*", cors());

/* ----------------------------------------------
   Middleware
----------------------------------------------- */
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// static file hosting
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
   Health Check
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
