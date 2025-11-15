// middleware/roleMiddleware.js
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Require ${role} role`
      });
    }

    next();
  };
};

// 快速版本
export const requireAdmin = requireRole("ADMIN");
export const requireInfluencer = requireRole("INFLUENCER");
export const requireAdvertiser = requireRole("ADVERTISER");
export const requireAgent = requireRole("AGENT");
