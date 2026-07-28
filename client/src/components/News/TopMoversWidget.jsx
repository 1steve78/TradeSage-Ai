import React, { useState } from "react";
import { Zap, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Brain } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

/**
 * TopMoversWidget Component
 *
 * Displays top market movers paired with evidence-grounded AI explanations.
 */
export const TopMoversWidget = ({ topMovers = [] }) => {
  const [expandedSymbol, setExpandedSymbol] = useState(null);

  if (!topMovers || topMovers.length === 0) return null;

  const toggleExpand = (symbol) => {
    setExpandedSymbol((prev) => (prev === symbol ? null : symbol));
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md">
      <div className="flex items-center gap-2 mb-xs">
        <Zap className="w-5 h-5 text-amber-500" />
        <h3 className="font-title-sm text-sm font-bold text-[#0f172a] uppercase tracking-wider">
          ⚡ Top Movers AI Breakdown
        </h3>
      </div>

      <div className="space-y-sm">
        {topMovers.map((item) => {
          const isPositive = !item.change.startsWith("-");
          const isExpanded = expandedSymbol === item.symbol;

          return (
            <div
              key={item.symbol}
              className="border border-outline-variant/60 rounded overflow-hidden transition"
            >
              {/* Header row */}
              <div
                onClick={() => toggleExpand(item.symbol)}
                className="p-md bg-surface-container-low hover:bg-slate-200 transition cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-md">
                  <span className="font-data-mono font-bold text-sm text-[#0f172a]">
                    {item.symbol}
                  </span>
                  <span
                    className={`font-data-mono text-xs font-bold flex items-center gap-0.5 ${
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {item.change}
                  </span>
                </div>

                <div className="flex items-center gap-md">
                  <ConfidenceBadge confidence={item.confidence} />
                  <button className="text-slate-500 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Explainer Drawer */}
              {isExpanded && (
                <div className="p-md bg-white border-t border-outline-variant/40 space-y-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                    <Brain className="w-3.5 h-3.5 text-primary" />
                    <span>Why did {item.symbol} move?</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.explanation}
                  </p>

                  {item.sources && item.sources.length > 0 && (
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span>Sources:</span>
                      {item.sources.map((src, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMoversWidget;
