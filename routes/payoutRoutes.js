import express from "express";
import { payoutController } from "../controllers/payoutController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 可提现余额
router.get("/withdrawable", authMiddleware, payoutController.withdrawable);

// 请求提现
router.post("/request", authMiddleware, payoutController.request);

// 我的提现记录
router.get("/my", authMiddleware, payoutController.myPayouts);

export default router;
