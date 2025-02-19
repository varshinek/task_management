import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendApi } from "../config";
import { useNavigate } from "react-router-dom";

const TaskForm = ({ token, setTasks }) => { 
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");

  const navigate = useNavigate(); // Initialize navigate

  console.log("Rendering TaskForm");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting task:", { name, deadline, priority, status });

    if (!name) {
      toast.error("Task name is required!");
      return;
    }

    try {
      console.log("Backend API URL:", `${backendApi}/api/v1/tasks`);

      const response = await fetch(`${backendApi}/api/v1/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, deadline, priority, status }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add task");
      }

      console.log("Task successfully added:", data);

      // Update state with the new task
      setTasks((prev) => [...prev, data?.data]); 

      // Reset form
      setName("");
      setDeadline("");
      setPriority("Low");
      setStatus("Pending");

      toast.success("Task added successfully!");

      // Debug log before navigation
      console.log("Navigating to dashboard");
      navigate("/dashboard"); // 🔥 Redirect to Dashboard
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.message || "Failed to add task");
    }
  };

  return (
    <div className="ml-0 md:ml-10 m-5 md:m-20 md:mt-2 mt-2 border border-gray-300 shadow-xl p-4 md:p-6 w-full md:w-96 rounded-2xl">
      <form onSubmit={handleSubmit}>
        <label className="text-lg md:text-xl">Task Name:</label>
        <input
          className="border border-black mt-3 md:mt-5 p-3 rounded-lg mb-5 w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
        />

        <label className="text-lg md:text-xl">Deadline:</label>
        <input
          className="border border-black mt-3 md:mt-5 p-3 rounded-lg mb-5 w-full"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <label className="text-lg md:text-xl">Priority:</label>
        <select
          className="border border-black mt-3 md:mt-5 p-3 rounded-lg mb-5 w-full"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="text-lg md:text-xl">Status:</label>
        <select
          className="border border-black mt-3 md:mt-5 p-3 rounded-lg mb-5 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          className="mt-6 md:mt-10 font-semibold text-white border border-green-600 bg-green-600 p-3 w-full rounded-lg text-lg md:text-xl"
          type="submit"
        >
          + Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
