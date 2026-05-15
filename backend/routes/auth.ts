import bcrypt from "bcrypt";

import { Router } from "express";

import { prisma } from "../lib/prisma";

import { generateToken } from "../lib/jwt";
import { authRateLimiter, protectedRouteLimiter } from "../middlewares/rate-limit";

import { authMiddleware } from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/register", authRateLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
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

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

authRouter.post("/login", authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

authRouter.get("/me", authMiddleware, protectedRouteLimiter, async (req, res) => {
  return res.status(200).json({
    message: "Authenticated user",
    user: req.user,
  });
});

export default authRouter;
