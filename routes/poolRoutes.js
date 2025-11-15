import express from "express";
import { poolController } from "../controllers/poolController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// visitor 可看
router.get("/current", poolController.current);

// 必须登录
router.get("/qualification", authMiddleware, poolController.myQualification);

// 管理员触发分盘
router.post(
  "/settle",
  authMiddleware,
  requireAdmin,  
  poolController.settle
);

export default router;
