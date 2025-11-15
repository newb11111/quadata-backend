import express from "express";
import { adminController } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin only
router.use(authMiddleware, requireAdmin);

// Influencer 审核
router.get("/influencer/pending", adminController.pendingInfluencers);
router.post("/influencer/:id/approve", adminController.approveInfluencer);
router.post("/influencer/:id/reject", adminController.rejectInfluencer);

// Advertiser 审核
router.get("/advertiser/pending", adminController.pendingAdvertisers);
router.post("/advertiser/:id/approve", adminController.approveAdvertiser);
router.post("/advertiser/:id/reject", adminController.rejectAdvertiser);

// Payout 审核
router.get("/payout/pending", adminController.pendingPayouts);
router.post("/payout/:id/approve", adminController.approvePayout);
router.post("/payout/:id/reject", adminController.rejectPayout);

export default router;
