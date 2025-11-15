// utils/referral.js
import { prisma } from "../config/prisma.js";

/**
 * 获取 referral chain（最多 N 层）
 * 例如：depth = 3 → [firstReferrer, secondReferrer, thirdReferrer]
 */
export const getReferralChain = async (userId, depth = 3) => {
  const chain = [];
  let current = userId;

  for (let i = 0; i < depth; i++) {
    const ref = await prisma.referral.findFirst({
      where: { referredId: current }
    });

    if (!ref) break;

    chain.push(ref.referrerId);
    current = ref.referrerId;
  }

  return chain; // 可能是 [], [A], [A,B], [A,B,C]
};

/**
 * 检查某用户是否推荐到多少 influencer
 */
export const countInfluencersReferred = async (userId) => {
  const refs = await prisma.referral.findMany({
    where: { referrerId: userId }
  });

  let total = 0;

  for (const r of refs) {
    const inf = await prisma.influencer.findFirst({
      where: { userId: r.referredId }
    });

    if (inf) total++;
  }

  return total;
};
