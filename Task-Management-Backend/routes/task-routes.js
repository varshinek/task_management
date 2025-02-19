import express from "express";
import taskController from "../controllers/task-controllers.js";
import authenticateJWT from "../middlewares/auth-middleware.js"; // ✅ Correct import

const router = express.Router();

// Task Routes with Authentication Middleware
router.post("/", authenticateJWT, taskController.createTask);
router.get("/", authenticateJWT, taskController.getAllTasks);
router.get("/:taskId", authenticateJWT, taskController.getTaskById);
router.put("/:taskId", authenticateJWT, taskController.updateTaskById);
router.delete("/:taskId", authenticateJWT, taskController.deleteTaskById);

export default router;
