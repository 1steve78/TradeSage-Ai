import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCw, AlertCircle, Sparkles } from "lucide-react";

import NewsSkeleton from "./NewsSkeleton";
import MarketHeatCard from "./MarketHeatCard";
import MarketSummaryCard from "./MarketSummaryCard";
import TrendingNews from "./TrendingNews";
import TopMoversWidget from "./TopMoversWidget";
import NewsList from "./NewsList";

const fetchNewsDashboard = async () => {
  const { data } = await axios.get("/api/news/dashboard");
  if (!data?.success) throw new Error("Failed to fetch news dashboard");
  return data.data;
};

/**
 * NewsDashboard Component
 *
 * Full financial news dashboard leveraging TanStack Query for optimal client caching.
 */
export const NewsDashboard = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["newsDashboard"],
    queryFn: fetchNewsDashboard,
    staleTime: 15 * 60 * 1000, // 15 minutes cache in memory
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <NewsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded shadow-xs text-center space-y-md my-lg">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div>
          <h4 className="font-title-sm text-base font-bold text-[#0f172a]">
            Unable to load market news
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {error?.message || "Check your internet connection or server connection."}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:opacity-90 transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-gutter animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-md">
        <div>
          <h2 className="font-display-lg text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight flex items-center gap-2">
            Institutional Market Intelligence
          </h2>
          <p className="text-secondary text-xs font-medium">
            Real-time news feeds, AI market summaries, and evidence-grounded price explanations.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-3 py-1.5 bg-surface-container-low border border-outline-variant hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Row 1: Market Heat (1 col) + AI Market Summary (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-1">
          <MarketHeatCard marketHeat={data.marketHeat} />
        </div>
        <div className="lg:col-span-2">
          <MarketSummaryCard summary={data.summary} />
        </div>
      </div>

      {/* Row 2: Top Movers AI Breakdown */}
      {data.topMovers && data.topMovers.length > 0 && (
        <TopMoversWidget topMovers={data.topMovers} />
      )}

      {/* Row 3: Trending Market News */}
      {data.trending && data.trending.length > 0 && (
        <TrendingNews articles={data.trending} />
      )}

      {/* Row 4: Latest Headlines Grid with Category Tabs */}
      <NewsList articles={data.latest} />
    </div>
  );
};

export default NewsDashboard;
