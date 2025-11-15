import { authService } from "../services/authService.js";

export const authController = {
  register: async (req, res) => {
    try {
      const data = await authService.register(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const data = await authService.login(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
