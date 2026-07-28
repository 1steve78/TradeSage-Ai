import React from "react";
import { X, ExternalLink, Clock, Newspaper, Sparkles } from "lucide-react";

/**
 * NewsDetailsModal Component
 *
 * Popup modal showing full article detail inside TradeSage AI without
 * navigating users away immediately.
 */
export const NewsDetailsModal = ({ article, onClose }) => {
  if (!article) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-outline-variant rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-lg space-y-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 transition rounded hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Source & Date Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Newspaper className="w-4 h-4 text-primary" />
          <span>{article.source || "FINNHUB"}</span>
          <span className="text-slate-300">•</span>
          <span className="font-data-mono text-slate-400 flex items-center gap-1 font-normal">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display-lg text-lg sm:text-xl font-bold text-[#0f172a] leading-tight">
          {article.title}
        </h3>

        {/* Sentiment Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Sentiment:</span>
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded border border-slate-200">
            {article.badge} {article.sentiment || "Neutral"}
          </span>
          {article.sentimentScore !== undefined && (
            <span className="text-xs font-data-mono text-slate-400 font-bold">
              Score: {article.sentimentScore}/100
            </span>
          )}
        </div>

        {/* Image if available */}
        {article.image && (
          <div className="rounded overflow-hidden border border-outline-variant max-h-56">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        {/* Article Summary */}
        <div className="bg-surface-container-low p-md rounded border border-outline-variant/60 space-y-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Article Executive Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {article.summary || "No extended summary text provided by news feed."}
          </p>
        </div>

        {/* Action Footer */}
        <div className="pt-md border-t border-outline-variant/40 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-container-low hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition cursor-pointer"
          >
            Close
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:opacity-90 transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            Read Original Article <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsModal;
