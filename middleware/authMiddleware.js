// middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing or invalid token"
      });
    }

    const token = header.split(" ")[1];

    let decoded;
    try {
      decoded = verifyToken(token); // { id, role }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token"
      });
    }

    // Check in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found"
      });
    }

    req.user = user; // { id, role }
    next();

  } catch (err) {
    console.error("authMiddleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error (authMiddleware)"
    });
  }
};
