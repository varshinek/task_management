import express from "express";
import projectsRouter from "./routes/project-routes.js";
import tasksRouter from "./routes/task-routes.js";
import healthcheckRouter from "./routes/healthcheck-routes.js";
import authRouter from "./routes/auth-routes.js";
import { PORT } from "./config/env-config.js";
import cors from "cors";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // Security headers
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet()); // Adding security headers

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/user", authRouter);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Server is shutting down...");
  await mongoose.connection.close(); // Close the database connection
  process.exit(0); // Exit the process
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
