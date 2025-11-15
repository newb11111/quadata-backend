import { prisma } from "../config/prisma.js";

export const influencerService = {

  // 1️⃣ 创建或更新网红资料
  saveProfile: async ({ userId, shortBio, longBio, price, totalFollower, topPlatform, images }) => {
    let inf = await prisma.influencer.findUnique({
      where: { userId }
    });

    if (!inf) {
      // 创建新资料
      inf = await prisma.influencer.create({
        data: {
          userId,
          shortBio,
          longBio,
          price,
          totalFollower,
          topPlatform,
          status: "PENDING" // 新上传 = 待审核
        }
      });
    } else {
      // 更新资料
      inf = await prisma.influencer.update({
        where: { userId },
        data: {
          shortBio,
          longBio,
          price,
          totalFollower,
          topPlatform,
          status: "PENDING" // 每次更新重新审核
        }
      });

      // 删除旧图（如果你想保留也可以）
      await prisma.influencerImage.deleteMany({
        where: { influencerId: inf.id }
      });
    }

    // 保存新图片
    for (const img of images) {
      await prisma.influencerImage.create({
        data: {
          influencerId: inf.id,
          imageUrl: img
        }
      });
    }

    return inf;
  },

  // 2️⃣ 获取某个 influencer（公开）
  getPublicProfile: async (id) => {
    return await prisma.influencer.findFirst({
      where: { id, status: "APPROVED" },
      include: { images: true, user: true }
    });
  },

  // 3️⃣ 获取自己上传的资料（登录用户）
  getMyProfile: async (userId) => {
    return await prisma.influencer.findFirst({
      where: { userId },
      include: { images: true }
    });
  }
};
