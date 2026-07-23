import React, { useState, useEffect } from "react";
import { useMarketPulse, useRefreshMarketPulse } from "../../hooks/useAI";
import { Sparkles, RefreshCw, Clock, CheckCircle2, Zap } from "lucide-react";
import InsightHistory from "./InsightHistory";

const LOADING_MESSAGES = [
  "🧠 Analyzing Market Data...",
  "📰 Reading Recent Headlines...",
  "📊 Comparing Portfolio Holdings...",
  "⚡ Generating AI Insights via NIM...",
];

const MarketPulse = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useMarketPulse();
  const refreshMutation = useRefreshMarketPulse();
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const isRefreshing = isFetching || refreshMutation.isPending;
  const pulseData = data?.data;

  // Rotate loading step messages every 1 second
  useEffect(() => {
    let interval = null;
    if (isLoading || isRefreshing) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1000);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, isRefreshing]);

  const handleRefresh = () => {
    refreshMutation.mutate({ forceRefresh: true });
  };

  const getFormattedTime = (dateStr) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);
    if (diffSecs < 60) return "Just now";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderFormattedSummary = (summaryText) => {
    if (!summaryText) return null;
    const lines = summaryText.split("\n").filter((line) => line.trim().length > 0);

    return (
      <div className="space-y-2 text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          const isHeading = line.includes("🧠") || line.toLowerCase().includes("summary:");
          const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || /^\d+\./.test(line.trim());

          if (isHeading) {
            return (
              <h4 key={idx} className="font-bold text-emerald-400 text-sm flex items-center gap-1.5 pt-1">
                {line.replace(/^#+\s*/, "")}
              </h4>
            );
          }

          if (isBullet) {
            const cleanText = line.replace(/^[•\-\d+\.]\s*/, "");
            return (
              <div key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-pulse" />
                <p className="text-slate-300 text-xs font-medium">{cleanText}</p>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-300 text-xs font-medium bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  🧠 Market Pulse
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> NIM Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Real-time AI portfolio & market intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pulseData && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                  pulseData.cached
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {pulseData.cached ? "Retrieved from Cache" : "Generated Fresh"}
              </span>
            )}

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer border border-slate-700 flex items-center gap-2 text-xs font-semibold"
              title="Refresh Market Pulse"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh AI Insight"}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative z-10">
          {isLoading || (isRefreshing && !pulseData) ? (
            <div className="space-y-3 py-6 text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-emerald-400 text-sm font-semibold animate-pulse">
                {LOADING_MESSAGES[loadingMsgIdx]}
              </p>
              <div className="max-w-md mx-auto space-y-2 pt-2">
                <div className="h-3 bg-slate-800/70 rounded w-3/4 mx-auto animate-pulse" />
                <div className="h-3 bg-slate-800/70 rounded w-full mx-auto animate-pulse" />
                <div className="h-3 bg-slate-800/70 rounded w-5/6 mx-auto animate-pulse" />
              </div>
            </div>
          ) : isError ? (
            <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg text-red-300 text-xs flex items-center justify-between">
              <span>{error?.response?.data?.message || "Unable to generate market insights."}</span>
              <button
                onClick={() => refetch()}
                className="px-3 py-1 bg-red-800/40 hover:bg-red-800/60 rounded text-white font-semibold transition"
              >
                Retry
              </button>
            </div>
          ) : pulseData ? (
            <div className="space-y-4">
              {renderFormattedSummary(pulseData.summary)}

              {/* Footer Metadata */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 font-mono">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Updated {getFormattedTime(pulseData.generatedAt)}</span>
                </div>
                <span className="text-slate-400 text-[10px]">TradeSage AI Engine v1.0</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* AI Insight History Accordion / Drawer */}
      <InsightHistory />
    </div>
  );
};

export default MarketPulse;
