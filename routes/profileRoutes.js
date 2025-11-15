// routes/profileRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { profileController } from "../controllers/profileController.js";

const router = express.Router();

// 我的资料
router.get("/me", authMiddleware, profileController.me);

// 修改资料
router.post("/update", authMiddleware, profileController.update);

// 修改密码
router.post("/password", authMiddleware, profileController.updatePassword);

export default router;
