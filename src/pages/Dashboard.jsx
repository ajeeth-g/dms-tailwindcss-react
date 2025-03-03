import { useEffect } from "react";
import AIPoweredInsights from "../components/AIPoweredInsights";
import ChannelPerformance from "../components/ChannelPerformance";
import DailyOrders from "../components/DailyOrders";
import Greeting from "../components/Greeting";
import OrderDistribution from "../components/OrderDistribution";
import SalesChannelChart from "../components/SalesChannelChart";
import StatCard from "../components/StatCard";
import TeamDashboard from "../components/TeamDashboard";
import { doConnection } from "../services/connectionService";
import UploadDocumentPage from "./UploadDocumentPage";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
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
        <OrderDistribution />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <StatCard />
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1">
        <ChannelPerformance />
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1">
        <SalesChannelChart />
      </div>
      <div className="col-span-2">
        <DailyOrders />
      </div>
      <div className="col-span-2">
        <TeamDashboard />
      </div>
      <div className="col-span-2">
        <AIPoweredInsights />
      </div>
      <div className="col-span-2">
        <UploadDocumentPage />
      </div>
    </div>
  );
}
