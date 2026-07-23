import React, { useState } from "react";
import { useInsightHistory } from "../../hooks/useAI";
import { History, ChevronDown, ChevronUp, Calendar, Cpu } from "lucide-react";

const InsightHistory = () => {
  const { data, isLoading, isError } = useInsightHistory();
  const [expandedId, setExpandedId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const historyItems = data?.data || [];

  const toggleItem = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 font-sans overflow-hidden">
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer border-b border-slate-800"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">
            AI Insight History
          </span>
          {historyItems.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {historyItems.length} records
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>{isOpen ? "Hide History" : "View Previous Market Pulses"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-4 space-y-3 bg-slate-950/40">
          {isLoading ? (
            <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
              Loading insight history...
            </div>
          ) : isError ? (
            <div className="py-2 text-center text-xs text-red-400">
              Unable to load historical insights.
            </div>
          ) : historyItems.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500 font-medium">
              No historical AI insights recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {historyItems.map((item) => {
                const isExpanded = expandedId === item._id;
                return (
                  <div
                    key={item._id}
                    className="border border-slate-800 rounded-lg bg-slate-900/60 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item._id)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-300">
                          {item.type || "MARKET_PULSE"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          • {formatDate(item.generatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          Saved
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                        {item.summary}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightHistory;
