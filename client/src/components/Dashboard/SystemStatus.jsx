import useMarketStore from "../../store/marketStore";

const SystemStatus = () => {
  const connected = useMarketStore((state) => state.connected);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 flex justify-between items-center text-[10px] font-bold text-slate-600">
      <div className={`flex items-center gap-1.5 ${connected ? "text-emerald-600" : "text-rose-600"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
        <span>{connected ? "System Live" : "System Offline"}</span>
      </div>
      <div className="flex gap-3 text-slate-400">
        <span>LATENCY: <strong className="text-slate-700 font-mono">{connected ? "12ms" : "--"}</strong></span>
        <span>VOL (24H): <strong className="text-slate-700 font-mono">$4.2B</strong></span>
      </div>
    </div>
  );
};

export default SystemStatus;
