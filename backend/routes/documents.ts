import { Router } from "express";

import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";
import { protectedRouteLimiter } from "../middlewares/rate-limit";

const documentsRouter = Router();

documentsRouter.post("/", protectedRouteLimiter, authMiddleware, async (req, res) => {
  try {
    const { title, description, expiredDate } = req.body ?? {};
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!title || !expiredDate) {
      return res.status(400).json({
        message: "Title and Expired Date are required",
      });
    }

    const document = await prisma.document.create({
      data: { title, description, expiredDate: new Date(expiredDate), userId },
    });

    return res.status(201).json({
      message: "Document created successfully",
      document,
    });
  } catch (_error) {
    console.error("Create document error: ", _error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

documentsRouter.get("/", protectedRouteLimiter, authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Documents fetched Successfully",
      documents,
    });
  } catch (error) {
    console.error("Fetch documents error: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default documentsRouter;
