// services/profileService.js
import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const profileService = {

  // 1️⃣ 获取用户资料（不包含密码）
  getMyProfile: async (userId) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        state: true,
        role: true,
        createdAt: true
      }
    });
  },

  // 2️⃣ 更新用户资料
  updateProfile: async (userId, data) => {
    const allowed = {
      name: data.name,
      phone: data.phone,
      state: data.state,
    };

    return await prisma.user.update({
      where: { id: userId },
      data: allowed
    });
  },

  // 3️⃣ 更新密码
  updatePassword: async (userId, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error("Old password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 10);

    return await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    });
  }
};
