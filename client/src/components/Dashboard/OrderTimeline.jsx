import { useState, useEffect } from "react";
import { getAnalytics } from "../../services/tradingApi";

const OrderTimeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setTimeline(res.timeline);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-xl mt-6"></div>;
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-title-sm text-sm font-bold text-[#0f172a] mb-4">Audit Timeline</h3>
      <div className="space-y-4 border-l-2 border-[#e2e8f0] ml-2 pl-4">
        {timeline.map((event) => {
          let color = "bg-slate-200";
          if (event.type === "ORDER_EXECUTED") color = "bg-emerald-500";
          else if (event.type === "ORDER_CANCELLED") color = "bg-amber-500";
          else if (event.type === "ORDER_REJECTED") color = "bg-rose-500";
          else if (event.type === "ORDER_CREATED") color = "bg-indigo-500";

          return (
            <div key={event.id} className="relative">
              <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${color} ring-4 ring-white`}></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(event.timestamp).toLocaleString()}</span>
                <span className="text-xs font-semibold text-[#0f172a] mt-0.5">{event.message}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
