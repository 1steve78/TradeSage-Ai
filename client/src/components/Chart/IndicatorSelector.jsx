import React from 'react';

const AVAILABLE_INDICATORS = [
  { id: "sma20", label: "SMA20", color: "#2962FF" },
  { id: "sma50", label: "SMA50", color: "#FF9800" },
  { id: "sma200", label: "SMA200", color: "#9C27B0" },
  { id: "ema9", label: "EMA9", color: "#F44336" },
  { id: "ema21", label: "EMA21", color: "#4CAF50" },
];

const IndicatorSelector = ({ selectedIndicators, onToggle }) => {
  return (
    <div className="flex items-center gap-4 bg-white border border-[#e2e8f0] px-3 py-2 rounded mb-4 text-xs font-semibold">
      <span className="text-slate-400 mr-2 uppercase tracking-wider text-[10px]">Overlays</span>
      {AVAILABLE_INDICATORS.map((ind) => (
        <label key={ind.id} className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            className="accent-[#0f172a] cursor-pointer"
            checked={selectedIndicators.includes(ind.id)}
            onChange={() => onToggle(ind.id)}
          />
          <span className="text-[#0f172a]">{ind.label}</span>
          <span 
            className="w-2 h-2 rounded-full inline-block" 
            style={{ backgroundColor: ind.color }}
          ></span>
        </label>
      ))}
    </div>
  );
};

export default IndicatorSelector;
export { AVAILABLE_INDICATORS };
