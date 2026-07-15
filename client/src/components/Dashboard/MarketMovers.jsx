const MarketMovers = () => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-4">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Market Movers
      </h3>
      
      <div className="grid grid-cols-2 gap-3 text-center">
        {/* Top Gainer */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2px] p-3">
          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Top Gainer</span>
          <p className="font-bold text-sm text-[#0f172a] mt-1">PLTR</p>
          <p className="font-mono text-xs font-bold text-emerald-600 mt-0.5">+12.42%</p>
        </div>

        {/* Top Loser */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2px] p-3">
          <span className="text-[9px] text-rose-600 font-bold uppercase tracking-wider">Top Loser</span>
          <p className="font-bold text-sm text-[#0f172a] mt-1">META</p>
          <p className="font-mono text-xs font-bold text-rose-600 mt-0.5">-4.18%</p>
        </div>
      </div>
    </div>
  );
};

export default MarketMovers;
