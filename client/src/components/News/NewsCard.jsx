import React from "react";
import { ExternalLink, Clock, Newspaper } from "lucide-react";

/**
 * NewsCard Component
 *
 * Displays a single normalised article with source, headline, summary,
 * sentiment badge, and external link.
 */
export const NewsCard = ({ article }) => {
  if (!article) return null;

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getSentimentBadge = (sentiment, badge) => {
    if (sentiment === "Bullish") {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
          {badge || "🟢"} Bullish
        </span>
      );
    }
    if (sentiment === "Bearish") {
      return (
        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
          {badge || "🔴"} Bearish
        </span>
      );
    }
    return (
      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
        {badge || "🟡"} Neutral
      </span>
    );
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs hover:border-primary transition group flex flex-col justify-between space-y-md">
      <div className="space-y-sm">
        {/* Meta Header */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.source || "FINNHUB"}</span>
            <span className="text-slate-300">•</span>
            <span className="font-normal text-slate-400 lowercase flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          {getSentimentBadge(article.sentiment, article.badge)}
        </div>

        {/* Headline */}
        <h4 className="font-title-sm text-sm font-bold text-[#0f172a] group-hover:text-primary transition line-clamp-2 leading-snug">
          {article.title}
        </h4>

        {/* Summary */}
        {article.summary && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
            {article.summary}
          </p>
        )}
      </div>

      {/* Footer link */}
      <div className="pt-xs border-t border-outline-variant/30 flex justify-between items-center">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-slate-700 hover:text-primary transition inline-flex items-center gap-1 group-hover:underline"
        >
          Read Article <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-primary transition" />
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
