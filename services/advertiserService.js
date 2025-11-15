import { prisma } from "../config/prisma.js";

export const advertiserService = {

  // 1️⃣ 上传或更新资料
  saveProfile: async ({ userId, shortBio, longBio, price, address, images }) => {
    let adv = await prisma.advertiser.findUnique({
      where: { userId }
    });

    if (!adv) {
      // 创建广告主资料
      adv = await prisma.advertiser.create({
        data: {
          userId,
          shortBio,
          longBio,
          price,
          address,
          status: "PENDING"
        }
      });
    } else {
      // 更新资料
      adv = await prisma.advertiser.update({
        where: { userId },
        data: {
          shortBio,
          longBio,
          price,
          address,
          status: "PENDING"
        }
      });

      // 删除旧图片
      await prisma.advertiserImage.deleteMany({
        where: { advertiserId: adv.id }
      });
    }

    // 保存新图
    for (const img of images) {
      await prisma.advertiserImage.create({
        data: {
          advertiserId: adv.id,
          imageUrl: img
        }
      });
    }

    return adv;
  },

  // 2️⃣ visitor 公共页面
  getPublicProfile: async (id) => {
    return await prisma.advertiser.findFirst({
      where: { id, status: "APPROVED" },
      include: { images: true, user: true }
    });
  },

  // 3️⃣ 获取自己的资料
  getMyProfile: async (userId) => {
    return await prisma.advertiser.findFirst({
      where: { userId },
      include: { images: true }
    });
  }
};
