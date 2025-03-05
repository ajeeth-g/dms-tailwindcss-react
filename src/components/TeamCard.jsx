import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import React from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

const TeamCard = ({ user }) => {
  // Destructure the API response keys with fallbacks
  const {
    user_name,
    email_address,
    domain_user_name,
    emp_no,
    image,
    tasks = 10,
    completed = 8,
    documents = 10,
    pendingDocs = 2,
    lastActive = "N/A",
    priority = "N/A",
  } = user;

  const pendingTasks = tasks - completed;
  const progress = tasks > 0 ? Math.round((completed / tasks) * 100) : 0;
  const chartData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pendingTasks },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  return (
    <motion.div
      className="p-3 rounded-lg shadow-sm flex flex-col border border-gray-700 bg-gray-900"
      whileHover={{ scale: 1.02 }}
    >
      {/* Employee Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={image || "https://via.placeholder.com/40"}
          alt={user_name || domain_user_name}
          className="w-10 h-10 rounded-full border border-gray-600"
        />
        <div>
          <h3 className="text-sm font-medium text-white">
            {user_name || domain_user_name}
          </h3>
          <p className="text-xs text-gray-400">HR Manager</p>
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
          <p>✅ {completed} Tasks</p>
          <p>❌ {pendingTasks} Pending</p>
          <p>📄 {documents} Docs</p>
          <p className={pendingDocs > 0 ? "text-red-400" : "text-green-400"}>
            ⚠️ {pendingDocs} Pending
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="text-xs text-gray-400 flex justify-between">
          <span>Progress</span>
          <span>{Math.round((completed / tasks) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${(completed / tasks) * 100}%`,
              backgroundColor: "#10B981",
            }}
          />
        </div>
      </div>

      {/* Extra Info */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <p>
          <Clock className="inline w-3 h-3 mr-1" /> {lastActive}
        </p>
        <p
          className={
            user.priority === "High"
              ? "text-red-400"
              : user.priority === "Medium"
              ? "text-yellow-400"
              : "text-green-400"
          }
        >
          ⚠️ {priority} Priority
        </p>
      </div>
    </motion.div>
  );
};

export default TeamCard;
