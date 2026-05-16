import bcrypt from "bcrypt";

import { Router } from "express";

import { prisma } from "../lib/prisma.js";

import { generateToken } from "../lib/jwt.js";
import {
  authRateLimiter,
  protectedRouteLimiter,
} from "../middlewares/rate-limit.js";

import { authMiddleware } from "../middlewares/auth.js";

import { isValidEmail, normalizeString } from "../lib/validation.js";

import { sendError } from "../lib/http.js";

const authRouter = Router();

authRouter.post("/register", authRateLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    const normalizedName = normalizeString(name);
    const normalizedEmail = normalizeString(email);
    const normalizedPassword = normalizeString(password);

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return sendError(res, 400, "Name, email, and password are required");
    }

    if (!isValidEmail(normalizedEmail)) {
      return sendError(res, 400, "Email format is invalid");
    }

    if (normalizedPassword.length < 8) {
      return sendError(res, 400, "Password must be at least 8 characters long");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return sendError(res, 409, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "User Registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Register error: ", error);

    return sendError(res, 500, "Internal server error");
  }
});

authRouter.post("/login", authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    const normalizedEmail = normalizeString(email);
    const normalizedPassword = normalizeString(password);

    if (!normalizedEmail || !normalizedPassword) {
      return sendError(res, 400, "Email and Password are required");
    }

    if (!isValidEmail(normalizedEmail)) {
      return sendError(res, 400, "Email format is invalid");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return sendError(res, 401, "Invalid Email or Password");
    }

    const isPasswordValid = await bcrypt.compare(
      normalizedPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid Email or Password");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error: ", error);
    return sendError(res, 500, "Internal server error");
  }
});

authRouter.get(
  "/me",
  protectedRouteLimiter,
  authMiddleware,
  async (req, res) => {
    return res.status(200).json({
      message: "Authenticated user",
      user: req.user,
    });
  },
);

export default authRouter;
