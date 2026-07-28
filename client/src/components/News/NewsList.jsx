import React, { useState } from "react";
import NewsCategoryTabs from "./NewsCategoryTabs";
import NewsCard from "./NewsCard";
import { Newspaper } from "lucide-react";

/**
 * NewsList Component
 *
 * Filterable grid of news articles.
 */
export const NewsList = ({ articles = [] }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded text-center text-xs text-slate-500 font-medium space-y-2">
        <Newspaper className="w-8 h-8 text-slate-300 mx-auto" />
        <p>No headlines available right now.</p>
      </div>
    );
  }

  // Filter articles based on tab category keywords
  const filteredArticles = articles.filter((article) => {
    if (activeCategory === "all") return true;
    const text = `${article.title || ""} ${article.summary || ""}`.toLowerCase();
    if (activeCategory === "technology") {
      return text.includes("tech") || text.includes("software") || text.includes("ai") || text.includes("cloud") || text.includes("chip") || text.includes("data");
    }
    if (activeCategory === "banking") {
      return text.includes("bank") || text.includes("rbi") || text.includes("loan") || text.includes("credit") || text.includes("npa") || text.includes("interest");
    }
    if (activeCategory === "energy") {
      return text.includes("oil") || text.includes("gas") || text.includes("power") || text.includes("energy") || text.includes("green") || text.includes("solar");
    }
    if (activeCategory === "market") {
      return text.includes("nifty") || text.includes("sensex") || text.includes("stock") || text.includes("market") || text.includes("index");
    }
    return true;
  });

  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center">
        <h3 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider">
          📰 Latest Headlines
        </h3>
        <span className="text-[11px] font-bold text-slate-400">
          Showing {filteredArticles.length} of {articles.length} articles
        </span>
      </div>

      {/* Category Tabs */}
      <NewsCategoryTabs activeTab={activeCategory} onTabChange={setActiveCategory} />

      {/* Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded text-center text-xs text-slate-500 font-medium py-12">
          No articles matching category "{activeCategory}".
        </div>
      )}
    </div>
  );
};

export default NewsList;
