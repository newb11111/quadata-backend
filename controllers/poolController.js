import { poolService } from "../services/poolService.js";

export const poolController = {
  // 当前池子金额（visitor 也能看）
  current: async (req, res) => {
    const data = await poolService.getCurrentPool();
    res.json({ success: true, data });
  },

  // 用户资格
  myQualification: async (req, res) => {
    const userId = req.user.id;

    const qualify5 = await poolService.check5PercentQualification(userId);
    const qualify10 = await poolService.check10PercentQualification(userId);

    res.json({
      success: true,
      qualify5,
      qualify10
    });
  },

  // 管理员触发每月分盘
  settle: async (req, res) => {
    const result = await poolService.settleMonthlyPool();
    res.json({ success: true, result });
  }
};
