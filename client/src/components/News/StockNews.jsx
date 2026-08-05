import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Brain,
  Sparkles,
  Clock,
  LayoutGrid,
  ListOrdered,
  Layers,
  ChevronDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import SentimentDistribution from "./SentimentDistribution";
import NewsTimeline from "./NewsTimeline";
import NewsSearch from "./NewsSearch";
import NewsFilters from "./NewsFilters";
import NewsCard from "./NewsCard";
import NewsDetailsModal from "./NewsDetailsModal";

// Related sector mapping for smart cross-navigation
const SECTOR_RELATED = {
  TCS: [
    { symbol: "INFY", name: "Infosys Ltd." },
    { symbol: "WIPRO", name: "Wipro Ltd." },
  ],
  INFY: [
    { symbol: "TCS", name: "Tata Consultancy Services" },
    { symbol: "WIPRO", name: "Wipro Ltd." },
  ],
  RELIANCE: [
    { symbol: "ONGC", name: "Oil & Natural Gas Corp" },
    { symbol: "BPCL", name: "Bharat Petroleum" },
  ],
  SBIN: [
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd." },
  ],
  AAPL: [
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "NVDA", name: "NVIDIA Corp." },
  ],
};

const fetchStockNews = async (symbol) => {
  if (!symbol) return [];
  const { data } = await api.get(`/news/${symbol}`);
  if (!data?.success) throw new Error(`Failed to fetch news for ${symbol}`);
  return data.data || [];
};

/**
 * StockNews Component
 *
 * Comprehensive Stock News Experience component.
 */
export const StockNews = ({ symbol = "TCS", companyName }) => {
  const cleanSymbol = symbol.toUpperCase();

  const [viewMode, setViewMode] = useState("timeline"); // "timeline" | "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [visibleLimit, setVisibleLimit] = useState(6);

  const {
    data: articles = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["stockNews", cleanSymbol],
    queryFn: () => fetchStockNews(cleanSymbol),
    staleTime: 15 * 60 * 1000,
  });

  // Local Search & Filter logic
  const filteredArticles = articles.filter((article) => {
    // 1. Sentiment filter
    if (activeFilter === "BULLISH" && article.sentiment !== "Bullish") return false;
    if (activeFilter === "BEARISH" && article.sentiment !== "Bearish") return false;
    if (activeFilter === "NEUTRAL" && article.sentiment !== "Neutral") return false;

    // 2. Keyword Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const text = `${article.title || ""} ${article.summary || ""} ${article.source || ""}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  const visibleArticles = filteredArticles.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredArticles.length;
  const relatedList = SECTOR_RELATED[cleanSymbol] || [
    { symbol: "RELIANCE", name: "Reliance Industries" },
    { symbol: "SBIN", name: "State Bank of India" },
  ];

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-36"></div>
        <div className="h-24 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>{error?.message || `Unable to load news for ${cleanSymbol}.`}</span>
        </div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-surface-container-low hover:bg-slate-200 text-slate-700 rounded font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-gutter animate-in fade-in duration-200">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant/60 pb-sm">
        <div>
          <h3 className="font-display-lg text-lg font-bold text-[#0f172a] tracking-tight flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            {cleanSymbol} Institutional News Coverage
          </h3>
          <p className="text-secondary text-xs font-medium">
            Chronological timeline, sentiment distribution, and sector coverage.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded border border-outline-variant">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-2.5 py-1 text-xs font-bold rounded transition flex items-center gap-1 cursor-pointer ${
              viewMode === "timeline"
                ? "bg-white text-primary shadow-xs border border-outline-variant/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" /> Timeline View
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-2.5 py-1 text-xs font-bold rounded transition flex items-center gap-1 cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-primary shadow-xs border border-outline-variant/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grid View
          </button>
        </div>
      </div>

      {/* 2. Sentiment Distribution Bar */}
      <SentimentDistribution articles={articles} />

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-md items-center justify-between">
        <div className="w-full sm:w-72">
          <NewsSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
        <NewsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* 4. Articles Section */}
      {filteredArticles.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded text-center text-xs text-slate-500 font-medium py-12 space-y-md">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h4 className="font-title-sm text-sm font-bold text-[#0f172a]">
              📰 No recent news available for {cleanSymbol}
            </h4>
            <p className="text-slate-400 mt-1">
              Try adjusting your search query or sentiment filter.
            </p>
          </div>
        </div>
      ) : viewMode === "timeline" ? (
        <NewsTimeline
          articles={visibleArticles}
          onSelectArticle={(article) => setSelectedArticle(article)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {visibleArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="cursor-pointer"
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      )}

      {/* 5. Load More Pagination */}
      {hasMore && (
        <div className="text-center pt-md">
          <button
            onClick={() => setVisibleLimit((prev) => prev + 6)}
            className="px-5 py-2 bg-surface-container-low border border-outline-variant hover:bg-slate-200 text-slate-800 font-bold text-xs rounded transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Load More Articles</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. Related Sector Stocks Suggestions */}
      <div className="bg-surface-container-lowest border border-outline-variant p-md rounded shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-[#0f172a]">Related Sector Coverage:</span>
        </div>
        <div className="flex items-center gap-md flex-wrap">
          {relatedList.map((rel) => (
            <Link
              key={rel.symbol}
              to={`/stock/${rel.symbol}`}
              className="px-2.5 py-1 bg-surface-container-low hover:bg-slate-200 border border-outline-variant/60 text-slate-700 font-bold text-[11px] rounded transition"
            >
              {rel.symbol} ({rel.name})
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Article Detail Modal */}
      {selectedArticle && (
        <NewsDetailsModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default StockNews;
