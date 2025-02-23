import {
  FileText,
  Clock,
  CheckCircle,
  Trash2,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import StatCard from "../components/StatCard";
import DailyOrders from "../components/DailyOrders";
import OrderDistribution from "../components/OrderDistribution";
import UploadDocumentPage from "./UploadDocumentPage";
import SalesOverviewChart from "../components/SalesOverviewChart";
import SalesChannelChart from "../components/SalesChannelChart";
import ChannelPerformance from "../components/ChannelPerformance";
import AIPoweredInsights from "../components/AIPoweredInsights";
import MyTaskCard from "../components/MyTaskCard";
import TeamDashboard from "../components/TeamDashboard";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Documents",
      count: 120,
      icon: FileText,
      color: "#6366F1",
    },
    {
      title: "Approved Documents",
      count: 85,
      icon: CheckCircle,
      color: "#22C55E",
    },
    {
      title: "Pending Review",
      count: 25,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      title: "Deleted Files",
      count: 10,
      icon: Trash2,
      color: "#EF4444",
    },
  ];

  const orderStats = {
    totalOrders: "1,234",
    pendingOrders: "56",
    completedOrders: "1,178",
    totalRevenue: "₹98,765",
  };

  const userName = "Gopi"; // Replace with dynamic user data if needed
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <div className="pb-12 rounded-xl shadow-md w-full flex items-center gap-5 mb-5">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img
            alt="User Avatar"
            src="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Welcome Text */}
        <div>
          <h2 className="text-6xl font-normal">Welcome Back, {userName}! 👋</h2>
          <p className="text-sm opacity-90 mt-1">Today is {currentDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MyTaskCard />
        <div className="grid gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              name={stat.title}
              icon={stat.icon}
              value={stat.count}
              color={stat.color}
            />
          ))}
        </div>
        <OrderDistribution />
        <DailyOrders />
        <ChannelPerformance />
        <SalesChannelChart />
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <TeamDashboard />
        <AIPoweredInsights />
        <UploadDocumentPage />
      </div>
    </>
  );
}
