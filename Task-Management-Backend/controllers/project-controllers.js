import Project from "../models/project-models.js";
import Task from "../models/task-models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  if (!req?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const project = new Project({
    user: req.user.id,
    name,
    description,
  });

  await project.save();
  res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

const getProjects = asyncHandler(async (req, res) => {
  if (!req?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const projects = await Project.find({ user: req.user.id });

  res.status(200).json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!req?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const project = await Project.findOne({
    _id: projectId,
    user: req.user.id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully"));
});

const updateProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!req?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const project = await Project.findOne({
    _id: projectId,
    user: req.user.id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.name = name;
  project.description = description;
  await project.save();

  res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

const deleteProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!req?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const project = await Project.findOne({
    _id: projectId,
    user: req.user.id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Delete associated tasks
  await Task.deleteMany({ project: projectId });

  // Delete the project itself
  await Project.deleteOne({ _id: projectId });

  res.status(200).json(new ApiResponse(200, null, "Project and associated tasks deleted successfully"));
});

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
