// services/referralService.js
import { prisma } from "../config/prisma.js";

/**
 * Referral service
 */
export const referralService = {
  /**
   * Create a referral: referrerId referredId
   * - Validations:
   *   - no self-referral
   *   - referred must not already have a referrer
   *   - referrer and referred must exist
   */
  createReferral: async (referrerId, referredId) => {
    if (referrerId === referredId) {
      throw new Error("Cannot refer yourself");
    }

    const [referrer, referred] = await Promise.all([
      prisma.user.findUnique({ where: { id: referrerId } }),
      prisma.user.findUnique({ where: { id: referredId } })
    ]);
    if (!referrer || !referred) throw new Error("User not found");

    const existing = await prisma.referral.findFirst({
      where: { referredId }
    });
    if (existing) throw new Error("This user already has a referrer");

    // optional: prevent simple cycles: ensure referrer is not a descendant of referred
    // get up-chain of referrer and make sure referredId not present
    let cursor = referrerId;
    for (let i = 0; i < 10; i++) {
      const up = await prisma.referral.findFirst({ where: { referredId: cursor } });
      if (!up) break;
      if (up.referrerId === referredId) {
        throw new Error("Referral cycle detected");
      }
      cursor = up.referrerId;
    }

    const created = await prisma.referral.create({
      data: {
        referrerId,
        referredId
      }
    });

    return created;
  },

  /**
   * Get direct referrals (users referred by userId)
   */
  getReferralsByReferrer: async (referrerId) => {
    return await prisma.referral.findMany({
      where: { referrerId },
      include: {
        referred: {
          select: { id: true, name: true, email: true, role: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Get direct referrer of a user (who referred this user)
   */
  getReferrer: async (userId) => {
    const ref = await prisma.referral.findFirst({
      where: { referredId: userId }
    });
    if (!ref) return null;
    return prisma.user.findUnique({ where: { id: ref.referrerId }, select: { id: true, name: true, email: true, role: true } });
  },

  /**
   * Get referral chain upwards (closest first).
   * Returns array of user objects [level1User, level2User, ...] up to `depth`.
   */
  getReferralChain: async (userId, depth = 3) => {
    const chain = [];
    let current = userId;

    for (let i = 0; i < depth; i++) {
      const link = await prisma.referral.findFirst({ where: { referredId: current } });
      if (!link) break;
      const referrer = await prisma.user.findUnique({
        where: { id: link.referrerId },
        select: { id: true, name: true, email: true, role: true }
      });
      if (!referrer) break;
      chain.push(referrer);
      current = referrer.id;
    }

    return chain; // level1 = chain[0]
  },

  /**
   * Count how many referrals (that were referred this month) became Influencer profiles.
   * Used by pool qualification (i.e., invited influencers count).
   * - start/end optional Date objects; if omitted, will not filter by date.
   */
  countInfluencerReferrals: async (referrerId, start = null, end = null) => {
    // 1) get referrals in range (or all)
    const where = { referrerId };
    if (start && end) {
      where.createdAt = { gte: start, lte: end };
    }
    const refs = await prisma.referral.findMany({
      where,
      select: { referredId: true }
    });

    const referredIds = refs.map(r => r.referredId);
    if (referredIds.length === 0) return 0;

    // 2) count influencer profiles whose userId is in referredIds
    const count = await prisma.influencer.count({
      where: {
        userId: { in: referredIds }
      }
    });

    return count;
  }
};
