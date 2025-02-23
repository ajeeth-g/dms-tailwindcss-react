import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const tasks = [
  {
    id: 1,
    name: "Review Document Policy",
    time: "Today till 11:00 am",
    project: "DMS Compliance",
    assignee: "A",
  },
  {
    id: 2,
    name: "Approve Contract Document",
    time: "Today till 01:00 pm",
    project: "Legal Docs",
    assignee: "L",
  },
  {
    id: 3,
    name: "Metadata Update for Reports",
    time: "Feb 24, 2025 04:00 pm",
    project: "DMS Optimization",
    assignee: "D",
  },
  {
    id: 4,
    name: "Migrate Archived Files",
    time: "June 30",
    project: "Storage Management",
    assignee: "S",
  },
  {
    id: 5,
    name: "Version Control Review",
    time: "July 4",
    project: "Audit & Logs",
    assignee: "V",
  },
];

const pageSize = 3; // Number of tasks per page

export default function MyTaskCard() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tasks.length / pageSize);

  const paginatedTasks = tasks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">My Tasks</h2>
        <a href="#" className="text-blue-500 text-sm hover:underline">
          See all
        </a>
      </div>

      <div className="flex flex-col">
        {/* Task List */}
        <ul className="space-y-3">
          {paginatedTasks.map((task) => (
            <motion.li
              key={task.id}
              className="flex items-center justify-between border-b pb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 border-2 border-blue-500 rounded-full"></span>
                <div>
                  <p className="text-sm font-medium">{task.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {task.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{task.project}</span>
                <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-semibold">
                  {task.assignee}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
