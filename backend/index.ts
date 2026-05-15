import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
