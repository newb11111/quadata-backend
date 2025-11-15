import { prisma } from "../config/prisma.js";

export const adminService = {

  // -------------------------------------------------------------------
  // 获取待审核列表（influencer）
  // -------------------------------------------------------------------
  getPendingInfluencers: async () => {
    return prisma.influencer.findMany({
      where: { status: "PENDING" },
      include: { user: true, images: true }
    });
  },

  // 审核 influencer
  approveInfluencer: async (id) => {
    return prisma.influencer.update({
      where: { id },
      data: { status: "APPROVED" }
    });
  },

  rejectInfluencer: async (id) => {
    return prisma.influencer.update({
      where: { id },
      data: { status: "REJECTED" }
    });
  },

  // -------------------------------------------------------------------
  // Advertiser
  // -------------------------------------------------------------------
  getPendingAdvertisers: async () => {
    return prisma.advertiser.findMany({
      where: { status: "PENDING" },
      include: { user: true, images: true }
    });
  },

  approveAdvertiser: async (id) => {
    return prisma.advertiser.update({
      where: { id },
      data: { status: "APPROVED" }
    });
  },

  rejectAdvertiser: async (id) => {
    return prisma.advertiser.update({
      where: { id },
      data: { status: "REJECTED" }
    });
  }
};
