import { Router } from "express";
import authCheck from "../middlewares/auth-middleware.js";
import AuthController from "../controllers/auth-controllers.js";
import zValidateRequest from "../middlewares/zod-validator-middleware.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../lib/zod-schema/userSchema.js";

const router = Router();

// Register route: Validates input, then calls registerUser controller
router.post(
  "/register",
  zValidateRequest(registerUserSchema),
  AuthController.registerUser
);

// Login route: Validates input, then calls loginUser controller
router.post(
  "/login",
  zValidateRequest(loginUserSchema),
  AuthController.loginUser
);

// Profile route: Checks if the user is authenticated, then fetches user profile
router.get("/profile", authCheck, AuthController.getUser);

// Catch-all route for undefined paths
router.all("*", (req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

export default router;
