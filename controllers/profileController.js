// controllers/profileController.js
import { profileService } from "../services/profileService.js";

export const profileController = {

  // 1️⃣ 获取自己的资料
  me: async (req, res) => {
    try {
      const data = await profileService.getMyProfile(req.user.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 2️⃣ 更新基本资料
  update: async (req, res) => {
    try {
      const userId = req.user.id;
      const updated = await profileService.updateProfile(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 3️⃣ 更改密码
  updatePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      await profileService.updatePassword(userId, oldPassword, newPassword);

      res.json({ success: true, message: "Password updated" });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
