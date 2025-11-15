import { payoutService } from "../services/payoutService.js";

export const payoutController = {

  // 可提现金额
  withdrawable: async (req, res) => {
    try {
      const amount = await payoutService.getWithdrawableAmount(req.user.id);
      res.json({ success: true, amount });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 请求提现
  request: async (req, res) => {
    try {
      const { amount } = req.body;
      const payout = await payoutService.createPayoutRequest(req.user.id, amount);
      res.json({ success: true, data: payout });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 我的提现记录
  myPayouts: async (req, res) => {
    try {
      const list = await payoutService.myPayouts(req.user.id);
      res.json({ success: true, data: list });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
