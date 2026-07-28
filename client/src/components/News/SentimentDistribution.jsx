import React from "react";
import { Smile, Meh, Frown } from "lucide-react";

/**
 * SentimentDistribution Component
 *
 * Renders sentiment distribution bars (Bullish %, Neutral %, Bearish %) for a stock.
 */
export const SentimentDistribution = ({ articles = [] }) => {
  if (!articles || articles.length === 0) return null;

  const total = articles.length;
  let bullish = 0;
  let neutral = 0;
  let bearish = 0;

  articles.forEach((a) => {
    if (a.sentiment === "Bullish") bullish++;
    else if (a.sentiment === "Bearish") bearish++;
    else neutral++;
  });

  const bullishPct = Math.round((bullish / total) * 100);
  const neutralPct = Math.round((neutral / total) * 100);
  const bearishPct = Math.round((bearish / total) * 100);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-sm">
      <div className="flex justify-between items-center">
        <h4 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider">
          😊 Sentiment Distribution
        </h4>
        <span className="text-[11px] font-bold text-slate-500">
          Based on {total} articles
        </span>
      </div>

      {/* Percentage Indicators */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-2 rounded flex flex-col items-center">
          <span className="flex items-center gap-1 text-[11px] mb-0.5">
            <Smile className="w-3.5 h-3.5" /> Bullish
          </span>
          <span className="font-data-mono text-sm">{bullishPct}%</span>
        </div>

        <div className="bg-amber-50 text-amber-700 border border-amber-200 p-2 rounded flex flex-col items-center">
          <span className="flex items-center gap-1 text-[11px] mb-0.5">
            <Meh className="w-3.5 h-3.5" /> Neutral
          </span>
          <span className="font-data-mono text-sm">{neutralPct}%</span>
        </div>

        <div className="bg-rose-50 text-rose-700 border border-rose-200 p-2 rounded flex flex-col items-center">
          <span className="flex items-center gap-1 text-[11px] mb-0.5">
            <Frown className="w-3.5 h-3.5" /> Bearish
          </span>
          <span className="font-data-mono text-sm">{bearishPct}%</span>
        </div>
      </div>

      {/* Stacked Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex mt-2">
        <div style={{ width: `${bullishPct}%` }} className="bg-emerald-500 transition-all duration-300" title={`Bullish: ${bullishPct}%`} />
        <div style={{ width: `${neutralPct}%` }} className="bg-amber-400 transition-all duration-300" title={`Neutral: ${neutralPct}%`} />
        <div style={{ width: `${bearishPct}%` }} className="bg-rose-500 transition-all duration-300" title={`Bearish: ${bearishPct}%`} />
      </div>
    </div>
  );
};

export default SentimentDistribution;
