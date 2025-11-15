import express from "express";
import { influencerController } from "../controllers/influencerController.js";
import { influencerUpload } from "../middleware/uploadImage.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 上传 / 更新资料（必须登录）
router.post(
  "/save",
  authMiddleware,
  influencerUpload.array("images", 10),
  influencerController.saveProfile
);

// 获取公开资料（visitor 也能看）
router.get("/:id", influencerController.publicProfile);

// 获取用户自己的资料（登录）
router.get("/me/profile", authMiddleware, influencerController.myProfile);

export default router;
