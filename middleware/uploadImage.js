import multer from "multer";
import path from "path";
import fs from "fs";

// 保存到 uploads/influencers/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/influencers";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const influencerUpload = multer({ storage });
