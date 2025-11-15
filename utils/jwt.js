// utils/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "changeme";
const EXPIRES = process.env.JWT_EXPIRES || "30d";

// generateToken = signToken（两个名字都给，避免你前面代码报错）
export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
};

export const signToken = generateToken; // alias

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
