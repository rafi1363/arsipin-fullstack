import bcrypt from "bcrypt";

import { Router } from "express";

import { prisma } from "../lib/prisma";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
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

export default authRouter;
