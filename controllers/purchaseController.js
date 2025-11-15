import { purchaseService } from "../services/purchaseService.js";

export const purchaseController = {
  buy: async (req, res) => {
    try {
      const { packageId } = req.body;
      const userId = req.user.id; // 从 JWT 来

      const purchase = await purchaseService.buyPackage({
        userId,
        packageId
      });

      res.json({ success: true, purchase });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
