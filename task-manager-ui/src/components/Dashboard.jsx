import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Add_icon from "../assets/icons/add-icon.svg";
import Default_user_icon from "../assets/icons/default-user-icon.svg";
import Navbar from "./Navbar";
import TaskForm from "./TaskForm";
import { backendApi } from "../config";

export default function Dashboard({ token, setToken }) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendApi}/api/v1/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data?.data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (token) fetchTasks();
  }, [token]);

  const handleEditStatus = (taskId, currentStatus) => {
    setEditingTaskId(taskId);
    setUpdatedStatus((prev) => ({ ...prev, [taskId]: currentStatus }));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setUpdatedStatus((prev) => ({ ...prev, [taskId]: newStatus }));
  };

  const handleSaveStatus = async (taskId) => {
    const newStatus = updatedStatus[taskId] || tasks.find(task => task._id === taskId)?.status;

    try {
      const response = await fetch(`${backendApi}/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${backendApi}/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-0 sm:p-2 flex w-full gap-3 bg-white">
      <Navbar token={token} setToken={setToken} />
      <div className="min-h-screen flex flex-col w-full items-center bg-white">
        {/* Add Task Button */}
        <div className="flex justify-between items-center w-full p-2 bg-white rounded-3xl border border-gray-300">
          <div className="flex gap-4 ml-auto">
            <button
              className="bg-primary text-white py-1 px-2 text-sm rounded-xl border hover:bg-blue-600 transition"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              <div className="flex items-center gap-1">
                <img src={Add_icon} className="w-6" alt="add icon" />
                <span>{showTaskForm ? "Close Form" : "Add Task"}</span>
              </div>
            </button>
            <img src={Default_user_icon} className="w-9 cursor-pointer" alt="user icon" />
          </div>
        </div>

        {/* Show TaskForm */}
        {showTaskForm && <TaskForm token={token} setTasks={setTasks} navigate={navigate} />} 

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl mt-4">
          {tasks.length === 0 ? (
            <p className="text-gray-600 text-center col-span-4">No tasks available.</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-white p-4 border shadow-md rounded-lg flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{task.name}</h3>
                <p className="text-sm text-gray-600">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString("en-GB") : "N/A"}</p>
                <p className="text-sm font-medium">Priority: {task.priority || "Medium"}</p>

                {/* Status Section */}
                <div>
                  <p className="font-medium">Status:</p>
                  {editingTaskId === task._id ? (
                    <select
                      className="border rounded-md p-1 w-full mt-1"
                      value={updatedStatus[task._id] ?? task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-700">{task.status}</p>
                  )}
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex justify-between mt-3">
                  {editingTaskId === task._id ? (
                    <button className="bg-black text-white px-3 py-1 rounded-md" onClick={() => handleSaveStatus(task._id)}>Save</button>
                  ) : (
                    <button className="bg-black text-white px-3 py-1 rounded-md" onClick={() => handleEditStatus(task._id, task.status)}>Edit</button>
                  )}
                  <button className="bg-red-600 text-white px-3 py-1 rounded-md" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
