import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./src/config/db.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// CORS: local dev + production frontends (comma-separated FRONTEND_URL in .env)
const defaultOrigins = ["http://localhost:3000", "http://localhost:5173"];
const extraOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

// Global middleware
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//🚀 Routes
app.use("/api/health", (await import("./src/routes/health.js")).default);
app.use("/api/auth", (await import("./src/routes/auth.js")).default);
app.use("/api/volunteers", (await import("./src/routes/volunteer.js")).default);
app.use("/api/reports", (await import("./src/routes/report.js")).default);
app.use("/api/needs", (await import("./src/routes/need.js")).default);
app.use("/api/matching", (await import("./src/routes/matching.js")).default);
app.use(
  "/api/assignments",
  (await import("./src/routes/assignment.js")).default,
);
app.use("/api/summaries", (await import("./src/routes/summary.js")).default);
app.use("/api/dashboard", (await import("./src/routes/dashboard.js")).default);
// Error middleware - MUST be the last middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 ReliefSync AI Backend running on http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};
startServer();
