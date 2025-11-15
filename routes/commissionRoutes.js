import express from "express";
import { commissionController } from "../controllers/commissionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", authMiddleware, commissionController.myCommission);
router.get("/total", authMiddleware, commissionController.myCommissionTotal);

export default router;
