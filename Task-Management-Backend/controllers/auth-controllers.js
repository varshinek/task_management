import User from "../models/user-models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env-config.js";
import successResponse from "../lib/res/successRespones.js";
import errorResponse from "../lib/res/errorResponse.js";
import StatusCodes from "http-status-codes";
import { cookieOptions } from "../lib/constants/cookieOptions.js";

// Utility function to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "2d" });
};

const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse(false, "User already exists", {}, StatusCodes.CONFLICT));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, username, password: hashedPassword });
    const user = await newUser.save();

    const token = generateToken(user._id);
    res.cookie("auth_session", token, cookieOptions);

    res.status(StatusCodes.CREATED).json(
      successResponse(
        true,
        "User created successfully",
        { id: user._id, email: user.email, username: user.username, token },
        StatusCodes.CREATED
      )
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      errorResponse(false, error.message, error, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(
        errorResponse(false, "User not found. Please register", {}, StatusCodes.NOT_FOUND)
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
        errorResponse(false, "Incorrect password", {}, StatusCodes.UNAUTHORIZED)
      );
    }

    const token = generateToken(user._id);
    res.cookie("auth_session", token, cookieOptions);

    res.status(StatusCodes.OK).json(
      successResponse(
        true,
        "Successfully logged in",
        { id: user._id, email: user.email, username: user.username, token },
        StatusCodes.OK
      )
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      errorResponse(false, error.message, error, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // Exclude password

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(
        errorResponse(false, "User not found", {}, StatusCodes.NOT_FOUND)
      );
    }

    return res.status(StatusCodes.OK).json(
      successResponse(true, "User details fetched successfully", user, StatusCodes.OK)
    );
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      errorResponse(false, error.message, error, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export default {
  registerUser,
  loginUser,
  getUser,
};
