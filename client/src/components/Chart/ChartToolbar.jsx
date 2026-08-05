import React from 'react';
import { BarChart2, LineChart, Activity } from 'lucide-react';
export const AVAILABLE_INDICATORS = [
  { id: "sma20", label: "SMA20", color: "#2962FF" },
  { id: "sma50", label: "SMA50", color: "#FF9800" },
  { id: "sma200", label: "SMA200", color: "#9C27B0" },
  { id: "ema9", label: "EMA9", color: "#F44336" },
  { id: "ema21", label: "EMA21", color: "#4CAF50" },
];

const ChartToolbar = ({ 
  chartType, 
  setChartType, 
  timeframe, 
  setTimeframe, 
  selectedIndicators, 
  toggleIndicator 
}) => {
  const timeframes = ["15m", "1D", "1W", "1M", "1Y"];
  
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e2e8f0] px-3 py-2 rounded-t-lg border-b-0 text-xs font-semibold overflow-x-auto">
      {/* Chart Types */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-4 shrink-0">
        <button 
          onClick={() => setChartType('candlestick')}
          className={`p-1.5 rounded transition ${chartType === 'candlestick' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          title="Candlestick"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setChartType('line')}
          className={`p-1.5 rounded transition ${chartType === 'line' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          title="Line"
        >
          <LineChart className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setChartType('area')}
          className={`p-1.5 rounded transition ${chartType === 'area' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          title="Area"
        >
          <Activity className="w-4 h-4" />
        </button>
      </div>

      {/* Timeframes */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-4 shrink-0">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
              timeframe === tf
                ? "bg-primary text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Overlays */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-slate-400 uppercase tracking-wider text-[10px] mr-1">Overlays</span>
        {AVAILABLE_INDICATORS.map((ind) => (
          <label key={ind.id} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#0f172a] cursor-pointer"
              checked={selectedIndicators.includes(ind.id)}
              onChange={() => toggleIndicator(ind.id)}
            />
            <span className="text-[#0f172a]">{ind.label}</span>
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{ backgroundColor: ind.color }}
            ></span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChartToolbar;
