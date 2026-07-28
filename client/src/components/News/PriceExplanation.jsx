import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { TrendingUp, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import SourceList from "./SourceList";

/**
 * PriceExplanation Component
 *
 * Flagship AI component for explaining price movement using retrieved evidence.
 *
 * Props:
 *   symbol (string) - Stock ticker (e.g. "RELIANCE")
 *   priceChange (string|number) - Stock price change percentage or value (e.g. "+3.4%")
 */
export const PriceExplanation = ({ symbol, priceChange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExplanation = async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const changeParam = priceChange ? `?change=${encodeURIComponent(priceChange)}` : "";
      const res = await api.get(`/news/explain/${symbol}${changeParam}`);
      if (res.data?.success) {
        setData(res.data.data);
      } else {
        setError("Unable to generate price movement explanation.");
      }
    } catch (err) {
      console.error("[PriceExplanation] fetch error:", err);
      setError(err.response?.data?.message || "Failed to load price explanation.");
    } finally {
      setLoading(false);
    }
  };

  // Reset state when symbol changes to allow generating new explanation
  useEffect(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, [symbol]);

  if (!data && !loading && !error) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs flex flex-col items-center justify-center gap-sm border-l-4 border-l-primary">
        <Sparkles className="w-5 h-5 text-primary mb-1 animate-pulse" />
        <p className="text-xs text-slate-600 font-medium text-center">
          Want to know why {symbol} moved {priceChange}?
        </p>
        <button
          onClick={fetchExplanation}
          className="px-4 py-2 bg-surface-container-low hover:bg-slate-200 border border-outline-variant text-[#0f172a] rounded font-bold text-xs transition cursor-pointer mt-2"
        >
          Generate AI Explanation
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md animate-pulse">
        <div className="flex justify-between items-center border-b border-outline-variant/40 pb-sm">
          <div className="h-4 bg-slate-200 rounded w-48"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>{error || "Price explanation unavailable."}</span>
        </div>
        <button
          onClick={fetchExplanation}
          className="px-2.5 py-1 bg-surface-container-low hover:bg-slate-200 text-slate-700 rounded font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md border-l-4 border-l-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-sm border-b border-outline-variant/40 pb-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-title-sm text-sm font-bold text-[#0f172a] tracking-tight">
            📈 Why did {data.symbol || symbol} move today?
          </h3>
          {data.cached && (
            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-200 uppercase">
              CACHED
            </span>
          )}
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      {/* Explanation Summary */}
      <p className="text-xs leading-relaxed text-slate-700 font-medium">
        {data.summary}
      </p>

      {/* Footer / Sources */}
      <div className="pt-sm border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
        <SourceList sources={data.sources} />
        <button
          onClick={fetchExplanation}
          className="text-[10px] text-slate-400 hover:text-slate-600 transition flex items-center gap-1 cursor-pointer"
          title="Refresh explanation"
        >
          <RefreshCw className="w-3 h-3" /> Refresh Analysis
        </button>
      </div>
    </div>
  );
};

export default PriceExplanation;
