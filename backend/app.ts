import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth.js";
import documentsRouter from "./routes/documents.js";

dotenv.config();

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: CORS_ORIGIN,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Arsipin backend is running",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/auth", authRouter);
app.use("/documents", documentsRouter);

export default app;
