import { influencerService } from "../services/influencerService.js";

export const influencerController = {
  
  // 用户上传 / 更新自己的网红资料
  saveProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { shortBio, longBio, price, totalFollower, topPlatform } = req.body;

      const images = req.files?.map(f => f.path) || [];

      const inf = await influencerService.saveProfile({
        userId,
        shortBio,
        longBio,
        price: Number(price),
        totalFollower: Number(totalFollower),
        topPlatform,
        images
      });

      res.json({ success: true, data: inf });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 获取公开网红资料（visitor 可看）
  publicProfile: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const inf = await influencerService.getPublicProfile(id);
      res.json({ success: true, data: inf });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 获取自己的网红资料
  myProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const inf = await influencerService.getMyProfile(userId);
      res.json({ success: true, data: inf });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
