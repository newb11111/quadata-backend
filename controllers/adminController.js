import { prisma } from "../config/prisma.js";
import { payoutService } from "../services/payoutService.js";

export const adminController = {

  // -----------------------------------------
  // Influencer 审核
  // -----------------------------------------
  pendingInfluencers: async (req, res) => {
    try {
      const list = await prisma.influencer.findMany({
        where: { status: "PENDING" },
        include: { user: true, images: true }
      });

      res.json({ success: true, data: list });
    } catch (err) {
      console.error("pendingInfluencers:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  approveInfluencer: async (req, res) => {
    try {
      await prisma.influencer.update({
        where: { id: Number(req.params.id) },
        data: { status: "APPROVED" }
      });

      res.json({ success: true, message: "Influencer approved" });
    } catch (err) {
      console.error("approveInfluencer:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  rejectInfluencer: async (req, res) => {
    try {
      await prisma.influencer.update({
        where: { id: Number(req.params.id) },
        data: { status: "REJECTED" }
      });

      res.json({ success: true, message: "Influencer rejected" });
    } catch (err) {
      console.error("rejectInfluencer:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // -----------------------------------------
  // Advertiser 审核
  // -----------------------------------------
  pendingAdvertisers: async (req, res) => {
    try {
      const list = await prisma.advertiser.findMany({
        where: { status: "PENDING" },
        include: { user: true, images: true }
      });

      res.json({ success: true, data: list });
    } catch (err) {
      console.error("pendingAdvertisers:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  approveAdvertiser: async (req, res) => {
    try {
      await prisma.advertiser.update({
        where: { id: Number(req.params.id) },
        data: { status: "APPROVED" }
      });

      res.json({ success: true, message: "Advertiser approved" });
    } catch (err) {
      console.error("approveAdvertiser:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  rejectAdvertiser: async (req, res) => {
    try {
      await prisma.advertiser.update({
        where: { id: Number(req.params.id) },
        data: { status: "REJECTED" }
      });

      res.json({ success: true, message: "Advertiser rejected" });
    } catch (err) {
      console.error("rejectAdvertiser:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // -----------------------------------------
  // Payout 审核
  // -----------------------------------------
  pendingPayouts: async (req, res) => {
    const data = await payoutService.getPendingPayouts();
    res.json({ success: true, data });
  },

  approvePayout: async (req, res) => {
    await payoutService.approvePayout(Number(req.params.id));
    res.json({ success: true, message: "Payout approved" });
  },

  rejectPayout: async (req, res) => {
    await payoutService.rejectPayout(Number(req.params.id));
    res.json({ success: true, message: "Payout rejected" });
  }
};
