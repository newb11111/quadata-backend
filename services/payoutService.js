import { prisma } from "../config/prisma.js";

export const payoutService = {

  // 计算用户可提现金额
  getWithdrawableAmount: async (userId) => {
    // 所有佣金总额
    const commission = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { toUserId: userId }
    });
    const totalCommission = commission._sum.amount || 0;

    // 已提现金额
    const payouts = await prisma.payout.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        status: "PAID"
      }
    });
    const totalPayout = payouts._sum.amount || 0;

    return totalCommission - totalPayout;
  },

  // 创建提现申请
  createPayoutRequest: async (userId, amount) => {
    amount = Number(amount);
    if (amount <= 0) throw new Error("Invalid amount");

    const available = await payoutService.getWithdrawableAmount(userId);
    if (amount > available) {
      throw new Error("Not enough balance to withdraw");
    }

    return await prisma.payout.create({
      data: {
        userId,
        amount,
        status: "PENDING"
      }
    });
  },

  // 用户自己的所有提现记录
  myPayouts: async (userId) => {
    return await prisma.payout.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  // Admin — 所有待处理的提现
  getPendingPayouts: async () => {
    return await prisma.payout.findMany({
      where: { status: "PENDING" },
      include: { user: true }
    });
  },

  // Admin — 审核通过
  approvePayout: async (id) => {
    return await prisma.payout.update({
      where: { id },
      data: { status: "PAID" }
    });
  },

  // Admin — 拒绝提现
  rejectPayout: async (id) => {
    return await prisma.payout.update({
      where: { id },
      data: { status: "CANCELLED" }
    });
  }
};
