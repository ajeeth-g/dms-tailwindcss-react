import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, FilePlus2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Button from "./common/Button";
import TaskForm from "./TaskForm";

const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Reviewer",
    tasks: 3,
    completed: 2,
    documents: 5,
    pendingDocs: 2,
    image:
      "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg",
    lastActive: "2 hrs ago",
    priority: "High",
  },
  {
    id: 2,
    name: "Emma Smith",
    role: "Analyst",
    tasks: 2,
    completed: 2,
    documents: 3,
    pendingDocs: 1,
    image:
      "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg",
    lastActive: "30 mins ago",
    priority: "Medium",
  },
  {
    id: 3,
    name: "Juliana Carter",
    role: "Officer",
    tasks: 4,
    completed: 3,
    documents: 2,
    pendingDocs: 1,
    image:
      "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg",
    lastActive: "1 day ago",
    priority: "Low",
  },
];

const COLORS = ["#10B981", "#EF4444"]; // Green: Completed, Red: Pending

export default function CompactDMSDashboard() {
  return (
    <div className="bg-gray-800 bg-opacity-50 shadow-md rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-lg font-semibold text-white">My Team</h2>
        <TaskForm />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {users.map((user) => {
          const pendingTasks = user.tasks - user.completed;
          const chartData = [
            { name: "Completed", value: user.completed },
            { name: "Pending", value: pendingTasks },
          ];

          return (
            <motion.div
              key={user.id}
              className="p-3 rounded-lg shadow-sm flex flex-col border border-gray-700 bg-gray-900"
              whileHover={{ scale: 1.02 }}
            >
              {/* Employee Info */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>

              {/* Pie Chart & Stats */}
              <div className="flex items-center gap-3">
                <PieChart width={60} height={60}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={28}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>

                <div className="text-xs text-gray-300">
                  <p>✅ {user.completed} Tasks</p>
                  <p>❌ {pendingTasks} Pending</p>
                  <p>📄 {user.documents} Docs</p>
                  <p
                    className={
                      user.pendingDocs > 0 ? "text-red-400" : "text-green-400"
                    }
                  >
                    ⚠️ {user.pendingDocs} Pending
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>Progress</span>
                  <span>
                    {Math.round((user.completed / user.tasks) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(user.completed / user.tasks) * 100}%`,
                      backgroundColor: "#10B981",
                    }}
                  />
                </div>
              </div>

              {/* Extra Info */}
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <p>
                  <Clock className="inline w-3 h-3 mr-1" /> {user.lastActive}
                </p>
                <p
                  className={`${
                    user.priority === "High"
                      ? "text-red-400"
                      : user.priority === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  ⚠️ {user.priority} Priority
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
