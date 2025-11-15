import express from "express";
import { advertiserController } from "../controllers/advertiserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { advertiserUpload } from "../middleware/advertiserUpload.js";

const router = express.Router();

// 上传 / 更新广告主资料
router.post(
  "/save",
  authMiddleware,
  advertiserUpload.array("images", 10),
  advertiserController.saveProfile
);

// visitor 公开资料
router.get("/:id", advertiserController.publicProfile);

// 获取本人资料
router.get("/me/profile", authMiddleware, advertiserController.myProfile);

export default router;
