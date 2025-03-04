import { useEffect } from "react";
import AIPoweredInsights from "../components/AIPoweredInsights";
import ChannelPerformance from "../components/ChannelPerformance";
import DailyReports from "../components/DailyReports";
import DocumentChannelChart from "../components/DocumentChannelChart";
import DocumentDistribution from "../components/DocumentDistribution";
import Greeting from "../components/Greeting";
import StatCard from "../components/StatCard";
import TeamDashboard from "../components/TeamDashboard";
import { useAuth } from "../context/AuthContext";
import { doConnection } from "../services/connectionService";
import DocumentListPage from "./DocumentListPage";

export default function DashboardPage() {
  const { auth, userData } = useAuth();

  useEffect(() => {
    const establishDoConnection = async () => {
      const doConnectionResult = await doConnection(
        userData.ClientURL,
        auth.email
      );
    };
    establishDoConnection();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div className="col-span-2">
        <Greeting />
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1">
        <DocumentDistribution />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <StatCard />
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1">
        <ChannelPerformance />
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1">
        <DocumentChannelChart />
      </div>
      <div className="col-span-2">
        <DailyReports />
      </div>
      <div className="col-span-2">
        <TeamDashboard />
      </div>
      <div className="col-span-2">
        <AIPoweredInsights />
      </div>
      <div className="col-span-2">
        <DocumentListPage />
      </div>
    </div>
  );
}
