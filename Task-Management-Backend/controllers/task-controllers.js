import Task from "../models/task-models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
    const { name, deadline, priority } = req.body;

    if (!req?.user?.id) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!name || !deadline || !priority) {
        throw new ApiError(400, "Name, deadline, and priority are required");
    }

    const task = new Task({
        name,
        deadline,
        priority,
    });

    await task.save();
    res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
    if (!req?.user?.id) {
        throw new ApiError(401, "Unauthorized");
    }

    const tasks = await Task.find();
    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(new ApiResponse(200, task, "Task retrieved successfully"));
});

const updateTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { name, deadline, priority, status } = req.body;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    if (!name || !deadline || !priority) {
        throw new ApiError(400, "Name, deadline, and priority are required");
    }

    const task = await Task.findById(taskId);
    
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.name = name;
    task.deadline = deadline;
    task.priority = priority;
    task.status = status || task.status;
    await task.save();

    res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await Task.deleteOne({ _id: taskId });

    res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

export default {
    createTask,
    updateTaskById,
    deleteTaskById,
    getTaskById,
    getAllTasks
};
