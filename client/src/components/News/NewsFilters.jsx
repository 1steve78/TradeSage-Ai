import React from "react";
import { Filter } from "lucide-react";

const FILTER_OPTIONS = [
  { id: "ALL", label: "All Sentiment" },
  { id: "BULLISH", label: "🟢 Bullish" },
  { id: "BEARISH", label: "🔴 Bearish" },
  { id: "NEUTRAL", label: "🟡 Neutral" },
];

/**
 * NewsFilters Component
 *
 * Sentiment filter chips for local filtering.
 */
export const NewsFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
        <Filter className="w-3 h-3" /> Filter:
      </span>
      {FILTER_OPTIONS.map((opt) => {
        const isActive = activeFilter === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onFilterChange(opt.id)}
            className={`px-2.5 py-1 text-xs font-bold rounded border transition cursor-pointer ${
              isActive
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-surface-container-low text-slate-600 border-outline-variant hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default NewsFilters;
