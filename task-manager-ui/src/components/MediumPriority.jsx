import React, { useState, useEffect } from "react";
import { backendApi } from "../config";
import { useNavigate } from "react-router-dom";

export default function MediumPriority({ token }) {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendApi}/api/v1/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        const mediumPriorityTasks = data?.data?.filter(task => task.priority === "Medium") || [];
        setTasks(mediumPriorityTasks);
      } catch (error) {
        console.error("Error fetching medium-priority tasks:", error);
      }
    };

    if (token) fetchTasks();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-yellow-600">Medium Priority Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-600 mt-4">No medium-priority tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 border shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <p className="text-sm text-gray-600">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString("en-GB") : "N/A"}</p>
              <p className="text-sm text-gray-700 font-medium">Status: {task.status}</p>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}
