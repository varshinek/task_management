import { Router } from "express";
import Project from "../controllers/project-controllers.js";
import authenticateJWT from "../middlewares/auth-middleware.js"; // ✅ Corrected Import

const router = Router();

// Route to create a project
router.post("/", authenticateJWT, Project.createProject);

// Route to fetch all projects
router.get("/", authenticateJWT, Project.getProjects);

// Route to get a specific project by its ID
router.get("/:projectId", authenticateJWT, Project.getProjectById);

// Route to update a project by its ID
router.put("/:projectId", authenticateJWT, Project.updateProjectById);

// Route to delete a project by its ID
router.delete("/:projectId", authenticateJWT, Project.deleteProjectById);

export default router;
