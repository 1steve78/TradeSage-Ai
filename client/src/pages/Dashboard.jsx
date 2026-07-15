import StatCards from "../components/Dashboard/StatCards";
import MarketChart from "../components/Dashboard/MarketChart";
import AIMarketPulse from "../components/Dashboard/AIMarketPulse";
import RecentTrades from "../components/Dashboard/RecentTrades";
import PriorityWatchlist from "../components/Dashboard/PriorityWatchlist";
import MarketMovers from "../components/Dashboard/MarketMovers";
import InstitutionalNews from "../components/Dashboard/InstitutionalNews";
import SystemStatus from "../components/Dashboard/SystemStatus";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top 3 Summary Cards */}
      <StatCards />

      {/* Grid: Left Column (Chart, AI, Trades) and Right Column (Watchlist, Movers, News, Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (3/4 Width) */}
        <div className="lg:col-span-3 space-y-6">
          <MarketChart />
          <AIMarketPulse />
          <RecentTrades />
        </div>

        {/* Right Column (1/4 Width) */}
        <div className="lg:col-span-1 space-y-6">
          <PriorityWatchlist />
          <MarketMovers />
          <InstitutionalNews />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;