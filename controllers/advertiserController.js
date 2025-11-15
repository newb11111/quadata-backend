import { advertiserService } from "../services/advertiserService.js";

export const advertiserController = {

  // 上传 / 更新资料
  saveProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { shortBio, longBio, price, address } = req.body;

      const images = req.files?.map(f => f.path) || [];

      const adv = await advertiserService.saveProfile({
        userId,
        shortBio,
        longBio,
        price: Number(price),
        address,
        images
      });

      res.json({ success: true, data: adv });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // visitor 看广告主
  publicProfile: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const adv = await advertiserService.getPublicProfile(id);
      res.json({ success: true, data: adv });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // 获取自己的资料
  myProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const adv = await advertiserService.getMyProfile(userId);
      res.json({ success: true, data: adv });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
