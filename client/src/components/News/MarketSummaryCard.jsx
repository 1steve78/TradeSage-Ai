import React from "react";
import { Brain, Sparkles, Clock } from "lucide-react";

/**
 * MarketSummaryCard Component
 *
 * Displays high-level AI market summary sitting prominently above the news feed.
 */
export const MarketSummaryCard = ({ summary }) => {
  if (!summary) return null;

  const formatTime = (isoString) => {
    if (!isoString) return "Just now";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs border-l-4 border-l-primary space-y-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-sm">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-title-sm text-sm font-bold text-[#0f172a] uppercase tracking-wider">
              🧠 AI Market Summary
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Synthesis
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {summary.text}
        </p>
      </div>

      <div className="pt-sm border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          Updated at {formatTime(summary.updatedAt)}
        </span>
        <span className="font-bold text-slate-600">
          Sentiment Bias: {summary.sentiment}
        </span>
      </div>
    </div>
  );
};

export default MarketSummaryCard;
