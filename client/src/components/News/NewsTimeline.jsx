import React from "react";
import { Clock, ExternalLink } from "lucide-react";

/**
 * NewsTimeline Component
 *
 * Chronological news timeline (newest to oldest) for tracking how events unfolded.
 */
export const NewsTimeline = ({ articles = [], onSelectArticle }) => {
  if (!articles || articles.length === 0) return null;

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  const formatTime = (dateStr) => {
    if (!dateStr) return "09:00";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md">
      <h4 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-md">
        📅 News Timeline
      </h4>

      <div className="relative pl-6 space-y-md border-l-2 border-slate-200">
        {sortedArticles.map((article, idx) => {
          const isBullish = article.sentiment === "Bullish";
          const isBearish = article.sentiment === "Bearish";

          const dotColor = isBullish
            ? "bg-emerald-500 ring-emerald-100"
            : isBearish
            ? "bg-rose-500 ring-rose-100"
            : "bg-amber-400 ring-amber-100";

          return (
            <div key={article.id || idx} className="relative group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full ${dotColor} ring-4 transition group-hover:scale-125`}
              />

              <div
                onClick={() => onSelectArticle && onSelectArticle(article)}
                className="bg-surface-container-low hover:bg-slate-200 p-md rounded border border-outline-variant/60 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span className="font-data-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatTime(article.publishedAt)} • {formatDate(article.publishedAt)}
                  </span>
                  <span className="uppercase text-slate-400">{article.source}</span>
                </div>

                <h5 className="font-bold text-xs text-[#0f172a] group-hover:text-primary transition line-clamp-2">
                  {article.title}
                </h5>

                {article.summary && (
                  <p className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                    {article.summary}
                  </p>
                )}

                <div className="flex justify-between items-center pt-1 text-[10px]">
                  <span className="font-bold text-slate-500">
                    {article.badge} {article.sentiment || "Neutral"}
                  </span>
                  <span className="text-slate-400 group-hover:text-primary transition flex items-center gap-0.5 font-bold">
                    View Details <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsTimeline;
