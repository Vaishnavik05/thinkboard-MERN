import dotenv from 'dotenv';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '../config/upstash.js';
dotenv.config();

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, '10s'),
});

export const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit(req.ip);
    if (!success) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};