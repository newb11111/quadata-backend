import { prisma } from "../config/prisma.js";
import { commissionService } from "./commissionService.js";
import { poolService } from "./poolService.js";

export const purchaseService = {
  buyPackage: async ({ userId, packageId }) => {
    // 1. 检查 user 是否存在
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // 2. 检查 package 是否存在
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new Error("Package not found");

    // 3. 检查是否已经购买过（例如 agent 不应该重复买）
    const existing = await prisma.purchase.findFirst({
      where: {
        userId,
        packageId
      }
    });

    if (existing) throw new Error("Already purchased this package");

    // 4. 创建 purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        packageId,
        amount: pkg.price
      }
    });

    // 5. 开通权限（更新 user.role）
    let newRole = "USER";

    if (pkg.packageType === "AGENT") newRole = "AGENT";
    if (pkg.packageType === "ADVERTISER") newRole = "ADVERTISER";
    if (pkg.packageType === "INFLUENCER") newRole = "INFLUENCER";

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    // 6. 分佣（自动触发三级）
    await commissionService.distributeCommission({
      buyerId: userId,
      purchaseId: purchase.id,
      amount: pkg.price
    });

    // 7. Pool 累积（5% + 10%）
    await poolService.addPool({
      userId,
      amount: pkg.price
    });

    return purchase;
  }
};
