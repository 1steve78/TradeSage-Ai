import React from "react";
import { TrendingUp, Flame } from "lucide-react";
import NewsCard from "./NewsCard";

/**
 * TrendingNews Component
 *
 * Featured grid of high-impact trending news articles.
 */
export const TrendingNews = ({ articles = [] }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-sm">
      <div className="flex items-center gap-2 mb-xs">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider">
          📈 Trending Market News
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default TrendingNews;
