import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  ClipboardCheck,
  FileQuestion,
  FileText,
  Loader,
} from "lucide-react";

const StatCard = () => {
  const stats = [
    {
      title: "Total Documents",
      name: "",
      count: 125,
      icon: FileText,
      color: "#6366F1",
      percentage: null,
    },
    {
      title: "Verified Documents",
      name: "Total Documents",
      count: 85,
      icon: CheckCircle,
      color: "#22C55E",
      percentage: ((85 / 125) * 100).toFixed(1),
    },
    {
      title: "Completed Documents",
      name: "Verified Documents",
      count: 20,
      icon: ClipboardCheck,
      color: "#F59E0B",
      percentage: ((20 / 85) * 100).toFixed(1),
    },
    {
      title: "In-progress Documents",
      name: "Verified Documents",
      count: 10,
      icon: Loader,
      color: "#3B82F6",
      percentage: ((10 / 85) * 100).toFixed(1),
    },
    {
      title: "Unassigned Documents",
      name: "Verified Documents",
      count: 10,
      icon: FileQuestion,
      color: "#EF4444",
      percentage: ((10 / 85) * 100).toFixed(1),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className={`
          ${index === stats.length - 5 ? "sm:col-span-2" : ""}
          bg-gradient-to-br from-gray-800 to-gray-900
          shadow-lg rounded-2xl p-4 border border-gray-700
          transition-transform transform hover:scale-105 hover:shadow-2xl
        `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <div className="flex items-center justify-between h-14">
            {/* Text Section */}
            <div className="text-start flex-1">
              <h3 className="text-xs font-semibold text-gray-400 tracking-wide">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-white leading-tight">
                {stat.count}
              </p>
            </div>

            {/* Icon Section */}
            <div
              className="w-14 h-14 p-4 rounded-xl flex items-center justify-center bg-opacity-50 shadow-md"
              style={{ backgroundColor: stat.color }}
            >
              <stat.icon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Percentage Display */}
          {stat.percentage !== null && (
            <div
              className={`flex items-center text-sm font-medium justify-start mt-6 ${
                parseFloat(stat.percentage) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {parseFloat(stat.percentage) >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
              <span>{stat.percentage}%</span>
              <span className="ml-1 text-xs text-gray-500">on {stat.name}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StatCard;
