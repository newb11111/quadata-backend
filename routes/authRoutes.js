import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { authController } from "../controllers/authController.js";

const router = express.Router();

// =========================
//        REGISTER / LOGIN
// =========================
router.post("/register", authController.register);
router.post("/login", authController.login);

// =====================================================
// 🚀 TEMP ROUTE: Create Default Admin (REMOVE AFTER USE)
// =====================================================
router.get("/create-default-admin", async (req, res) => {
  try {
    const email = "admin@quadata.my";
    const password = "123456";

    // Check if admin already exists
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.json({
        success: true,
        message: "Admin already exists",
        user: exist,
      });
    }

    // Create admin
    const hashed = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email,
        phone: "0000000000",
        password: hashed,
        role: "ADMIN",
      },
    });

    res.json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
