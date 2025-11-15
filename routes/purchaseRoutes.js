import express from "express";
import { purchaseController } from "../controllers/purchaseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/buy", authMiddleware, purchaseController.buy);

export default router;
