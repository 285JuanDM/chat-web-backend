import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const jwtService = {
  generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
  },

  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  }
};

// Express middleware
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
