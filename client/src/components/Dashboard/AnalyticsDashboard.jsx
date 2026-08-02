import { useState, useEffect } from "react";
import { getAnalytics } from "../../services/tradingApi";

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) return <div className="animate-pulse h-40 bg-slate-100 rounded-xl"></div>;

  const { metrics, tradingStats, performance } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0f172a] mt-1 tracking-tight">Trading Analytics</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">Real-time performance and execution metrics.</p>
      </div>

      {performance?.badges?.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {performance.badges.map(b => (
            <div key={b.id} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
              <span>{b.icon}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-900">{b.label}</span>
                <span className="text-[9px] font-medium text-indigo-600">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#e2e8f0] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Volume</span>
          <span className="text-lg font-data-mono font-bold text-[#0f172a] mt-2">₹{tradingStats.totalVolume.toLocaleString()}</span>
        </div>
        <div className="border border-[#e2e8f0] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Win Rate</span>
          <span className="text-lg font-data-mono font-bold text-emerald-600 mt-2">{metrics.successRate}%</span>
        </div>
        <div className="border border-[#e2e8f0] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Execution Time</span>
          <span className="text-lg font-data-mono font-bold text-indigo-600 mt-2">{tradingStats.averageLatencyMs} ms</span>
        </div>
        <div className="border border-[#e2e8f0] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-lg font-data-mono font-bold text-[#0f172a]">{metrics.totalOrders}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{metrics.executedOrders} Filled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
