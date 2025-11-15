// controllers/referralController.js
import { referralService } from "../services/referralService.js";

export const referralController = {
  // POST /api/referral/link
  // body: { referrerId }  -> current user becomes referred
  linkReferrer: async (req, res) => {
    try {
      const referredId = req.user.id;
      const { referrerId } = req.body;
      if (!referrerId) return res.status(400).json({ success: false, message: "referrerId required" });

      const created = await referralService.createReferral(Number(referrerId), Number(referredId));
      res.json({ success: true, data: created });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/referral/my  -> list referrals I made
  myReferrals: async (req, res) => {
    try {
      const userId = req.user.id;
      const list = await referralService.getReferralsByReferrer(userId);
      res.json({ success: true, data: list });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/referral/chain  -> get my upward chain (level1, level2, ...)
  // optional query ?depth=3
  myChain: async (req, res) => {
    try {
      const userId = req.user.id;
      const depth = Number(req.query.depth) || 3;
      const chain = await referralService.getReferralChain(userId, depth);
      res.json({ success: true, data: chain });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/referral/count-influencer?userId=xxx&start=YYYY-MM-DD&end=YYYY-MM-DD
  countInfluencerReferrals: async (req, res) => {
    try {
      const referrerId = Number(req.query.userId || req.user?.id);
      const { start, end } = req.query;
      const s = start ? new Date(start) : null;
      const e = end ? new Date(end) : null;

      const cnt = await referralService.countInfluencerReferrals(referrerId, s, e);
      res.json({ success: true, count: cnt });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
