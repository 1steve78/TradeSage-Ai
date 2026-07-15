const AIMarketPulse = () => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex gap-4 items-start flex-1">
        <div className="h-10 w-10 bg-slate-900 text-white rounded flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              AI Market Pulse
            </h4>
            <span className="text-[9px] text-slate-400 font-semibold font-mono">
              LAST UPDATED: 14:02 UTC
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
            Sentiment remains <strong className="text-[#0f172a] font-bold">Cautiously Bullish</strong>. Strong support levels identified at $65.8k. Institutional whale activity indicates accumulation in the mid-range. Recommend maintaining existing long positions with tight stops.
          </p>
        </div>
      </div>
      
      {/* Greed Index Dial */}
      <div className="h-16 w-16 bg-[#e6f4ea] border border-emerald-200 rounded-[4px] flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-xl font-bold text-emerald-800 font-mono">72</span>
        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Greed Index</span>
      </div>
    </div>
  );
};

export default AIMarketPulse;
