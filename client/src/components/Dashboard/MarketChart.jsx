import useMarketStore from "../../store/marketStore";

const MarketChart = () => {
  const pricesMap = useMarketStore((state) => state.prices);

  const btcPrice = pricesMap["BTC"]?.price ?? 67284.10;
  const btcPrev = pricesMap["BTC"]?.previousPrice ?? 67500.00;
  const btcChange = btcPrice - btcPrev;
  const btcPct = (btcChange / btcPrev) * 100;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-4">
      {/* Chart Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#f2f4f6]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              ₿
            </span>
            <h3 className="text-sm font-bold text-[#0f172a]">
              BTC/USDT
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-[#0f172a]">
              ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`font-mono text-xs font-bold ${btcChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {btcChange >= 0 ? "+" : ""}{btcPct.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timeframes */}
          <div className="flex bg-[#f2f4f6] p-0.5 rounded-[2px] text-[10px] font-bold text-slate-500">
            <button className="px-2.5 py-1 hover:text-slate-900">1H</button>
            <button className="px-2.5 py-1 hover:text-slate-900">4H</button>
            <button className="px-2.5 py-1 bg-white text-[#0f172a] shadow-sm rounded-[2px]">1D</button>
          </div>
          <div className="h-6 w-[1px] bg-[#e2e8f0]"></div>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
            <span className="material-symbols-outlined text-lg">show_chart</span>
          </button>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
            <span className="material-symbols-outlined text-lg">fullscreen</span>
          </button>
        </div>
      </div>

      {/* High-Fidelity Candlestick Chart Mock SVG */}
      <div className="h-80 w-full relative bg-slate-50 rounded-[2px] overflow-hidden border border-[#f2f4f6] p-4 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="#eceef0" strokeDasharray="3" />
          <line x1="0" y1="120" x2="800" y2="120" stroke="#eceef0" strokeDasharray="3" />
          <line x1="0" y1="190" x2="800" y2="190" stroke="#eceef0" strokeDasharray="3" />
          <line x1="0" y1="260" x2="800" y2="260" stroke="#eceef0" strokeDasharray="3" />

          <line x1="100" y1="0" x2="100" y2="300" stroke="#eceef0" strokeDasharray="3" />
          <line x1="250" y1="0" x2="250" y2="300" stroke="#eceef0" strokeDasharray="3" />
          <line x1="400" y1="0" x2="400" y2="300" stroke="#eceef0" strokeDasharray="3" />
          <line x1="550" y1="0" x2="550" y2="300" stroke="#eceef0" strokeDasharray="3" />
          <line x1="700" y1="0" x2="700" y2="300" stroke="#eceef0" strokeDasharray="3" />

          {/* Candle 1 (Green) */}
          <line x1="80" y1="140" x2="80" y2="220" stroke="#10b981" strokeWidth="2" />
          <rect x="70" y="160" width="20" height="40" fill="#10b981" rx="1" />

          {/* Candle 2 (Red) */}
          <line x1="160" y1="120" x2="160" y2="200" stroke="#ef4444" strokeWidth="2" />
          <rect x="150" y="130" width="20" height="50" fill="#ef4444" rx="1" />

          {/* Candle 3 (Green) */}
          <line x1="240" y1="90" x2="240" y2="170" stroke="#10b981" strokeWidth="2" />
          <rect x="230" y="100" width="20" height="50" fill="#10b981" rx="1" />

          {/* Candle 4 (Green) */}
          <line x1="320" y1="70" x2="320" y2="140" stroke="#10b981" strokeWidth="2" />
          <rect x="310" y="80" width="20" height="40" fill="#10b981" rx="1" />

          {/* Candle 5 (Red) */}
          <line x1="400" y1="90" x2="400" y2="220" stroke="#ef4444" strokeWidth="2" />
          <rect x="390" y="120" width="20" height="70" fill="#ef4444" rx="1" />

          {/* Candle 6 (Red) */}
          <line x1="480" y1="130" x2="480" y2="250" stroke="#ef4444" strokeWidth="2" />
          <rect x="470" y="160" width="20" height="60" fill="#ef4444" rx="1" />

          {/* Candle 7 (Green) */}
          <line x1="560" y1="110" x2="560" y2="180" stroke="#10b981" strokeWidth="2" />
          <rect x="550" y="120" width="20" height="40" fill="#10b981" rx="1" />

          {/* Candle 8 (Green) */}
          <line x1="640" y1="80" x2="640" y2="150" stroke="#10b981" strokeWidth="2" />
          <rect x="630" y="90" width="20" height="50" fill="#10b981" rx="1" />

          {/* Candle 9 (Red) */}
          <line x1="720" y1="100" x2="720" y2="170" stroke="#ef4444" strokeWidth="2" />
          <rect x="710" y="110" width="20" height="30" fill="#ef4444" rx="1" />

          {/* Moving Average Line (Cyan Curve) */}
          <path d="M 80 180 Q 200 130 320 100 T 560 140 T 720 120" fill="none" stroke="#06b6d4" strokeWidth="3" />
        </svg>
        <div className="absolute bottom-2 left-4 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
          BTC/USDT 1D Candlestick Chart Feed
        </div>
      </div>
    </div>
  );
};

export default MarketChart;
