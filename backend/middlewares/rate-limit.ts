import { rateLimit } from "express-rate-limit";

function buildRateLimiter(windowMs: number, max: number) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: "Too many requests, please try again later",
    },
  });
}

export const authRateLimiter = buildRateLimiter(15 * 60 * 1000, 20);
export const protectedRouteLimiter = buildRateLimiter(15 * 60 * 1000, 100);
