import { Router } from "express";

import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";
import { protectedRouteLimiter } from "../middlewares/rate-limit";
import { isValidDateInput, normalizeString, toDate } from "../lib/validation";
import { sendError } from "../lib/http";

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

      const normalizedTitle = normalizeString(title);
      const normalizedDescription =
        description === undefined ? undefined : normalizeString(description);

      if (!userId) {
        return sendError(res, 401, "Unauthorized");
      }

      if (!normalizedTitle || expiredDate === undefined) {
        return sendError(res, 400, "Title and expired date are required");
      }

      if (!isValidDateInput(expiredDate)) {
        return sendError(res, 400, "Expired date must be a valid date string");
      }

      const document = await prisma.document.create({
        data: {
          title: normalizedTitle,
          description: normalizedDescription,
          expiredDate: toDate(expiredDate),
          userId,
        },
      });

      return res.status(201).json({
        message: "Document created successfully",
        document,
      });
    } catch (_error) {
      console.error("Create document error: ", _error);
      return sendError(res, 500, "Internal Server Error");
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
        return sendError(res, 401, "Unauthorized");
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
      return sendError(res, 500, "Internal Server Error");
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
        return sendError(res, 401, "Unauthorized");
      }

      if (!documentId) {
        return sendError(res, 400, "Document id is required");
      }

      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
        },
      });

      if (!document) {
        return sendError(res, 404, "Document not found");
      }

      return res.status(200).json({
        message: "Document fetched successfully",
        document,
      });
    } catch (error) {
      console.error("Fetch document detail error: ", error);
      return sendError(res, 500, "Internal Server Error");
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

      const normalizedTitle =
        title === undefined ? undefined : normalizeString(title);
      const normalizedDescription =
        description === undefined ? undefined : normalizeString(description);

      if (!userId) {
        return sendError(res, 401, "Unauthorized");
      }

      if (!documentId) {
        return sendError(res, 400, "Document id is required");
      }

      if (
        title === undefined &&
        description === undefined &&
        expiredDate === undefined
      ) {
        return sendError(res, 400, "At least one field is required to update");
      }

      if (title !== undefined && !normalizedTitle) {
        return sendError(res, 400, "Title cannot be empty");
      }

      if (expiredDate !== undefined && !isValidDateInput(expiredDate)) {
        return sendError(res, 400, "Expired date must be a valid date string");
      }

      const existingDocument = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
        },
      });

      if (!existingDocument) {
        return sendError(res, 404, "Document not found");
      }

      const updatedDocument = await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          ...(normalizedTitle !== undefined ? { title: normalizedTitle } : {}),
          ...(description !== undefined
            ? { description: normalizedDescription }
            : {}),
          ...(expiredDate !== undefined
            ? { expiredDate: toDate(expiredDate) }
            : {}),
        },
      });

      return res.status(200).json({
        message: "Document updated successfully",
        document: updatedDocument,
      });
    } catch (error) {
      console.error("Update document error: ", error);
      return sendError(res, 500, "Internal Server Error");
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
        return sendError(res, 401, "Unauthorized");
      }

      if (!documentId) {
        return sendError(res, 400, "Document id is required");
      }

      const existingDocument = await prisma.document.findFirst({
        where: { id: documentId, userId },
      });

      if (!existingDocument) {
        return sendError(res, 404, "Document not found");
      }

      await prisma.document.delete({
        where: { id: documentId },
      });

      return res.status(200).json({
        message: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Delete document error: ", error);
      return sendError(res, 500, "Internal Server Error");
    }
  },
);

export default documentsRouter;
