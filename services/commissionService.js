import { prisma } from "../config/prisma.js";

export const commissionService = {
  // -------- 获取某个用户所有佣金 --------
  getUserCommission: async (userId) => {
    return await prisma.commission.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        purchase: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  // -------- 获取用户的佣金总金额 --------
  getUserCommissionTotal: async (userId) => {
    const sum = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { toUserId: userId }
    });

    return sum._sum.amount || 0;
  },

  // --------（来自 B）三级分佣 --------
  distributeCommission: async ({ buyerId, purchaseId, amount }) => {
    // Level 1
    const level1 = await prisma.referral.findFirst({
      where: { referredId: buyerId }
    });

    if (!level1) return;

    const level1Id = level1.referrerId;
    const level1Amount = amount * 0.15;

    await prisma.commission.create({
      data: {
        fromUserId: buyerId,
        toUserId: level1Id,
        purchaseId,
        amount: level1Amount
      }
    });

    // Level 2
    const level2 = await prisma.referral.findFirst({
      where: { referredId: level1Id }
    });

    if (!level2) return;

    const level2Id = level2.referrerId;
    const level2Amount = amount * 0.10;

    await prisma.commission.create({
      data: {
        fromUserId: buyerId,
        toUserId: level2Id,
        purchaseId,
        amount: level2Amount
      }
    });

    // Level 3
    const level3 = await prisma.referral.findFirst({
      where: { referredId: level2Id }
    });

    if (!level3) return;

    const level3Id = level3.referrerId;
    const level3Amount = amount * 0.05;

    await prisma.commission.create({
      data: {
        fromUserId: buyerId,
        toUserId: level3Id,
        purchaseId,
        amount: level3Amount
      }
    });
  }
};
