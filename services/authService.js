import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const authService = {
  // 注册
  register: async ({ name, email, phone, password, state, referralCode }) => {
    // 1. 检查 email 是否存在
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error("Email already exists");

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        state,
        password: hashedPassword,
        role: "USER"
      }
    });

    // 4. 若有 referralCode → 创建 referral 记录
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { id: Number(referralCode) }
      });

      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id
          }
        });
      }
    }

    // 5. 生成 JWT
    const token = generateToken(user);

    return { user, token };
  },

  // 登录
  login: async ({ email, password }) => {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = generateToken(user);

    return { user, token };
  }
};
