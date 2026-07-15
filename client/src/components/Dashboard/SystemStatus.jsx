const SystemStatus = () => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 flex justify-between items-center text-[10px] font-bold text-slate-600">
      <div className="flex items-center gap-1.5 text-emerald-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>System Live</span>
      </div>
      <div className="flex gap-3 text-slate-400">
        <span>LATENCY: <strong className="text-slate-700 font-mono">12ms</strong></span>
        <span>VOL (24H): <strong className="text-slate-700 font-mono">$4.2B</strong></span>
      </div>
    </div>
  );
};

export default SystemStatus;
