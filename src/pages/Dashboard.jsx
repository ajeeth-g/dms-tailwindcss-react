import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Loader,
} from "lucide-react";
import AIPoweredInsights from "../components/AIPoweredInsights";
import ChannelPerformance from "../components/ChannelPerformance";
import DailyOrders from "../components/DailyOrders";
import OrderDistribution from "../components/OrderDistribution";
import SalesChannelChart from "../components/SalesChannelChart";
import TeamDashboard from "../components/TeamDashboard";
import UploadDocumentPage from "./UploadDocumentPage";
import { useEffect } from "react";
import Greeting from "../components/Greeting";
import StatCard from "../components/StatCard";
import { doConnection } from "../services/connectionService";

export default function Dashboard() {
  useEffect(() => {
    const establishDoConnection = async () => {
      const doConnectionResult = await doConnection();
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
