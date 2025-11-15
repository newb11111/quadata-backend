// routes/userRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";
const router = express.Router();
router.get("/", authenticateToken, getAllUsers);
export default router;
