import React from "react";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * MarketHeatCard Component
 *
 * Displays broad market news sentiment score (0-100), label, and breakdown tallies.
 */
export const MarketHeatCard = ({ marketHeat }) => {
  if (!marketHeat) return null;

  const { score = 50, sentiment = "Neutral", badge = "🟡", breakdown = { bullish: 0, bearish: 0, neutral: 0, total: 0 } } = marketHeat;
  const total = breakdown.total || 1;

  const bullishPct = Math.round((breakdown.bullish / total) * 100);
  const neutralPct = Math.round((breakdown.neutral / total) * 100);
  const bearishPct = Math.round((breakdown.bearish / total) * 100);

  const getSentimentColor = () => {
    if (sentiment === "Bullish") return "text-emerald-600 border-emerald-200 bg-emerald-50";
    if (sentiment === "Bearish") return "text-rose-600 border-rose-200 bg-rose-50";
    return "text-amber-600 border-amber-200 bg-amber-50";
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-sm">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-title-sm text-sm font-bold text-[#0f172a] uppercase tracking-wider">
              Market Heat
            </h3>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSentimentColor()}`}>
            {badge} {sentiment}
          </span>
        </div>

        {/* Big Score */}
        <div className="flex items-baseline gap-2 my-2">
          <span className="font-data-mono text-3xl font-bold text-[#0f172a]">
            {score}
          </span>
          <span className="text-xs font-bold text-slate-400">/ 100</span>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Derived from recency-weighted sentiment analysis of live market news.
        </p>
      </div>

      {/* Breakdown Tally Bars */}
      <div className="space-y-1.5 pt-sm border-t border-outline-variant/40">
        <div className="flex justify-between text-[11px] font-bold text-slate-600">
          <span className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-3 h-3" /> Bullish ({breakdown.bullish})
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <Minus className="w-3 h-3" /> Neutral ({breakdown.neutral})
          </span>
          <span className="flex items-center gap-1 text-rose-600">
            <TrendingDown className="w-3 h-3" /> Bearish ({breakdown.bearish})
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${bullishPct}%` }} className="bg-emerald-500 transition-all duration-300" title={`Bullish: ${bullishPct}%`} />
          <div style={{ width: `${neutralPct}%` }} className="bg-amber-400 transition-all duration-300" title={`Neutral: ${neutralPct}%`} />
          <div style={{ width: `${bearishPct}%` }} className="bg-rose-500 transition-all duration-300" title={`Bearish: ${bearishPct}%`} />
        </div>
      </div>
    </div>
  );
};

export default MarketHeatCard;
