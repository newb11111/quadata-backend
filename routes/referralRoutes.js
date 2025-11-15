// routes/referralRoutes.js
import express from "express";
import { referralController } from "../controllers/referralController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// current user link to a referrer (after register or later)
router.post("/link", authMiddleware, referralController.linkReferrer);

// list my referrals
router.get("/my", authMiddleware, referralController.myReferrals);

// my referral chain (upwards)
router.get("/chain", authMiddleware, referralController.myChain);

// count influencer referrals (admin or user)
// optional query: userId, start, end
router.get("/count-influencer", authMiddleware, referralController.countInfluencerReferrals);

export default router;
