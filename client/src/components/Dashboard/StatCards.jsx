const StatCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* TOTAL NET WORTH */}
      <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 flex flex-col justify-between h-32">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Net Worth
          </h3>
          <p className="text-2xl font-bold text-[#0f172a] mt-2 font-sans tracking-tight">
            $1,284,592.42
          </p>
        </div>
        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-auto">
          <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
          +2.4% <span className="text-slate-400 font-medium">vs yesterday</span>
        </p>
      </div>

      {/* TODAY'S P&L */}
      <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 flex flex-col justify-between h-32">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Today's P&L
          </h3>
          <p className="text-2xl font-bold text-emerald-600 mt-2 font-sans tracking-tight">
            +$14,204.18
          </p>
        </div>
        <div className="mt-auto">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-[2px] border border-emerald-200">
            OUTPERFORMING
          </span>
        </div>
      </div>

      {/* PORTFOLIO HEALTH INDEX */}
      <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Portfolio Health Index
            </h3>
            <p className="text-base font-bold text-[#0f172a] mt-2">
              Institutional Core
            </p>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-xl">shield</span>
        </div>
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Health Score</span>
            <span className="font-mono">88/100</span>
          </div>
          <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-900 h-full w-[88%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
