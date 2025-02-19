import jwt from "jsonwebtoken";
import User from "../models/user-models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authenticateJWT = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(401, "Not authorized, no token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        throw new ApiError(401, "Not authorized, token failed");
    }
});

export default authenticateJWT; // ✅ Ensure default export
