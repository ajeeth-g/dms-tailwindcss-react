import {
  FileText,
  CheckCircle,
  Loader,
  ClipboardCheck,
  ArrowUpRight,
} from "lucide-react";
import DailyOrders from "../components/DailyOrders";
import OrderDistribution from "../components/OrderDistribution";
import UploadDocumentPage from "./UploadDocumentPage";
import SalesChannelChart from "../components/SalesChannelChart";
import ChannelPerformance from "../components/ChannelPerformance";
import AIPoweredInsights from "../components/AIPoweredInsights";
import TeamDashboard from "../components/TeamDashboard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Documents",
      name: "",
      count: 120,
      icon: FileText,
      color: "#6366F1",
      percentage: null,
    },
    {
      title: "Approved Documents",
      name: "Total Documents",
      count: 85,
      icon: CheckCircle,
      color: "#22C55E",
      percentage: ((85 / 120) * 100).toFixed(1),
    },
    {
      title: "Completed Documents",
      name: "Approved Documents",
      count: 25,
      icon: ClipboardCheck,
      color: "#F59E0B",
      percentage: ((25 / 120) * 100).toFixed(1),
    },
    {
      title: "In-progress Documents",
      name: "Approved Documents",
      count: 10,
      icon: Loader,
      color: "#3B82F6",
      percentage: ((10 / 120) * 100).toFixed(1),
    },
  ];

  const userName = "Gopi"; // Replace with dynamic user data if needed
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <div className="pb-12 rounded-xl w-full flex items-center gap-5 mb-2">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            alt="User Avatar"
            src="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Welcome Text */}
        <div>
          <h2 className="text-5xl font-normal">Welcome Back, {userName}! 👋</h2>
          <p className="text-sm opacity-90 mt-1">Today is {currentDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          return (
            <motion.div
              key={stat.title}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex flex-col items-start gap-4">
                {/* Text Section */}
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h3 className="text-xs font-medium text-gray-400">
                      {stat.title}
                    </h3>
                    <p className="text-4xl font-bold text-white leading-tight">
                      {stat.count}
                    </p>
                  </div>
                  {/* Icon Section */}
                  <div
                    className="p-3 rounded-full flex items-center justify-center bg-opacity-30"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Percentage Display */}
                {stat.percentage !== null && (
                  <div
                    className={`flex items-center text-sm font-medium mt-1 ${
                      stat.percentage >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.percentage >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="ml-1">{stat.percentage}%</span>
                    <span className="ml-2 text-xs text-gray-400">
                      on {stat.name}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* <MyTaskCard /> */}
        <OrderDistribution />
        <DailyOrders />
        <ChannelPerformance />
        <SalesChannelChart />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* <TeamPerformance /> */}
        <TeamDashboard />
        <AIPoweredInsights />
        <UploadDocumentPage />
      </div>
    </>
  );
}
