import { Router } from "express";

import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";
import { protectedRouteLimiter } from "../middlewares/rate-limit";

const documentsRouter = Router();

function getDocumentId(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}

documentsRouter.post(
  "/",
  protectedRouteLimiter,
  authMiddleware,
  async (req, res) => {
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
        data: {
          title,
          description,
          expiredDate: new Date(expiredDate),
          userId,
        },
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
  },
);

documentsRouter.get(
  "/",
  protectedRouteLimiter,
  authMiddleware,
  async (req, res) => {
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
  },
);

documentsRouter.get(
  "/:id",
  protectedRouteLimiter,
  authMiddleware,
  async (req, res) => {
    try {
      const documentId = getDocumentId(req.params.id);
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!documentId) {
        return res.status(400).json({
          message: "Document id is required",
        });
      }

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
        },
      });

      if (!document) {
        return res.status(404).json({
          message: "Document not found",
        });
      }

      return res.status(200).json({
        message: "Document fetched successfully",
        document,
      });
    } catch (error) {
      console.error("Fetch document detail error: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
);

documentsRouter.put(
  "/:id",
  protectedRouteLimiter,
  authMiddleware,
  async (req, res) => {
    try {
      const documentId = getDocumentId(req.params.id);
      const userId = req.user?.userId;
      const { title, description, expiredDate } = req.body ?? {};

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!documentId) {
        return res.status(400).json({
          message: "Document id is required",
        });
      }

      if (!title && !description && !expiredDate) {
        return res.status(400).json({
          message: "At least one field is required to update",
        });
      }

      const existingDocument = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
        },
      });

      if (!existingDocument) {
        return res.status(404).json({
          message: "Document not found",
        });
      }

      const updatedDocument = await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          ...(title !== undefined ? { title } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(expiredDate !== undefined
            ? { expiredDate: new Date(expiredDate) }
            : {}),
        },
      });

      return res.status(200).json({
        message: "Document updated successfully",
        document: updatedDocument,
      });
    } catch (error) {
      console.error("Update document error: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
);

documentsRouter.delete(
  "/:id",
  protectedRouteLimiter,
  authMiddleware,
  async (req, res) => {
    try {
      const documentId = getDocumentId(req.params.id);
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!documentId) {
        return res.status(400).json({
          message: "Document id is required",
        });
      }

      const existingDocument = await prisma.document.findFirst({
        where: { id: documentId, userId },
      });

      if (!existingDocument) {
        return res.status(404).json({
          message: "Document not found",
        });
      }

      await prisma.document.delete({
        where: { id: documentId },
      });

      return res.status(200).json({
        message: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Delete document error: ", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
);

export default documentsRouter;
