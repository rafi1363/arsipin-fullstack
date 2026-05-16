import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../lib/jwt.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is missing",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid Authorization format",
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (_error) {
    return res.status(401).json({
      message: "Invalid or Expired token",
    });
  }
}
