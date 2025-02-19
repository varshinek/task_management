import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import { backendApi } from "../config";

function TaskList({ token, setTaskCount }) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(`${backendApi}/api/v1/projects`, {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setProjects(data.data);
    };
    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`${backendApi}/api/v1/tasks`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, [token]);

  useEffect(() => {
    setTaskCount(tasks.filter((task) => task.status !== "Completed").length);
  }, [setTaskCount, tasks]);

  return (
    <div className="flex pt-0 pl-16 w-full h-full">
      <div className="section2 pl-64 w-full md:w-3/4 lg:w-full mx-auto p-5 bg-gray-200 rounded-lg border border-gray-300 shadow-lg">
        <button
          className={`p-3 px-10 border text-white mt-10 w-full rounded-lg font-semibold text-xl ${
            showTaskForm ? "bg-red-400 border-red-900" : "bg-blue-500 border-green-500"
          }`}
          onClick={() => {
            console.log("Toggling TaskForm:", !showTaskForm);
            setShowTaskForm(!showTaskForm);
          }}
        >
          {showTaskForm ? "Close Form" : "Add New Task"}
        </button>

        {showTaskForm && (
          <TaskForm
            token={token}
            projects={projects}
            setTasks={setTasks}
          />
        )}

        <ul className="task-list mt-5">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task._id} className="border p-3 rounded-lg bg-white shadow-md mb-3">
                <strong>{task.name}</strong> - <span className="text-gray-600">{task.status}</span>
              </li>
            ))
          ) : (
            <li>No tasks available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default TaskList;
