import { prisma } from "../config/prisma.js";
import dayjs from "dayjs";

export const poolService = {

  // -------------------------------------------------------------------
  // 1️⃣ 累积 pool（购买配套时触发）
  // -------------------------------------------------------------------
  addPool: async ({ userId, amount }) => {
    const five = amount * 0.05;
    const ten = amount * 0.10;

    await prisma.pool.create({
      data: {
        userId,
        fivePercent: five,
        tenPercent: ten
      }
    });
  },

  // -------------------------------------------------------------------
  // 2️⃣ 获取当前月份池子的总金额（visitor 也可以看）
  // -------------------------------------------------------------------
  getCurrentPool: async () => {
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();

    const sum = await prisma.pool.aggregate({
      _sum: {
        fivePercent: true,
        tenPercent: true
      },
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    return {
      fivePercent: sum._sum.fivePercent || 0,
      tenPercent: sum._sum.tenPercent || 0,
      total: (sum._sum.fivePercent || 0) + (sum._sum.tenPercent || 0)
    };
  },

  // -------------------------------------------------------------------
  // 3️⃣ 用户是否有资格参与 5% 池（邀请 ≥ 2 网红）
  // -------------------------------------------------------------------
  check5PercentQualification: async (userId) => {
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();

    const count = await prisma.referral.count({
      where: {
        referrerId: userId,
        createdAt: { gte: start, lte: end }
      }
    });

    return count >= 2;
  },

  // -------------------------------------------------------------------
  // 4️⃣ 用户是否有资格参与 10% 池（推荐链有 purchase）
  // -------------------------------------------------------------------
  check10PercentQualification: async (userId) => {
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();

    // 有没有人通过我 referral → 买配套？
    const referred = await prisma.referral.findMany({
      where: {
        referrerId: userId
      }
    });

    if (referred.length === 0) return false;

    const referredIds = referred.map(r => r.referredId);

    const purchases = await prisma.purchase.count({
      where: {
        userId: { in: referredIds },
        createdAt: { gte: start, lte: end }
      }
    });

    return purchases > 0;
  },

  // -------------------------------------------------------------------
  // 5️⃣ 每月分盘（系统调用）
  // -------------------------------------------------------------------
  settleMonthlyPool: async () => {
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();

    // Pool 总金额
    const pool = await prisma.pool.aggregate({
      _sum: {
        fivePercent: true,
        tenPercent: true
      },
      where: { createdAt: { gte: start, lte: end } }
    });

    const total5 = pool._sum.fivePercent || 0;
    const total10 = pool._sum.tenPercent || 0;

    // 找所有达人(合资格)分奖金
    const users = await prisma.user.findMany();

    let qualified5 = [];
    let qualified10 = [];

    for (const u of users) {
      if (await poolService.check5PercentQualification(u.id)) {
        qualified5.push(u.id);
      }
      if (await poolService.check10PercentQualification(u.id)) {
        qualified10.push(u.id);
      }
    }

    // 平分
    const perUser5 = qualified5.length ? total5 / qualified5.length : 0;
    const perUser10 = qualified10.length ? total10 / qualified10.length : 0;

    // 记录分盘结果（写入 Commission）
    for (const uid of qualified5) {
      await prisma.commission.create({
        data: {
          fromUserId: 0, 
          toUserId: uid,
          purchaseId: null,
          amount: perUser5,
          type: "POOL_5"
        }
      });
    }

    for (const uid of qualified10) {
      await prisma.commission.create({
        data: {
          fromUserId: 0,
          toUserId: uid,
          purchaseId: null,
          amount: perUser10,
          type: "POOL_10"
        }
      });
    }

    return {
      total5,
      total10,
      qualified5Count: qualified5.length,
      qualified10Count: qualified10.length,
      perUser5,
      perUser10
    };
  }
};
