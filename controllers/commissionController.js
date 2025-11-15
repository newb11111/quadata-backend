import { commissionService } from "../services/commissionService.js";

export const commissionController = {
  // 获取我的全部佣金记录
  myCommission: async (req, res) => {
    try {
      const userId = req.user.id;
      const records = await commissionService.getUserCommission(userId);
      res.json({ success: true, data: records });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 获取我的佣金余额（总额）
  myCommissionTotal: async (req, res) => {
    try {
      const userId = req.user.id;
      const total = await commissionService.getUserCommissionTotal(userId);
      res.json({ success: true, total });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
