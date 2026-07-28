import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Newspaper, AlertCircle, RefreshCw } from "lucide-react";

const NewsBulletinBox = ({ symbol }) => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/news/${symbol}`);
      if (data?.success) {
        setArticles(data.data || []);
      } else {
        setError("Failed to fetch news.");
      }
    } catch (err) {
      setError(err.message || "Unable to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refetch every 5 minutes
    const fetchInterval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, [symbol]);

  // Rotate through articles every 5 seconds
  useEffect(() => {
    if (articles.length === 0) return;
    const rotateInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(rotateInterval);
  }, [articles]);

  if (loading && articles.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs space-y-md animate-pulse h-48">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-16 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs flex items-center justify-between text-xs text-slate-500 h-48">
        <div className="flex items-center gap-2 text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
        <button onClick={fetchNews} className="px-2.5 py-1 bg-surface-container-low hover:bg-slate-200 text-slate-700 rounded font-bold transition flex items-center gap-1 cursor-pointer">
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs text-center text-xs text-slate-500 h-48 flex items-center justify-center">
        No recent news for {symbol}.
      </div>
    );
  }

  const article = articles[currentIndex];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-xs overflow-hidden flex flex-col h-48 relative">
      <div className="p-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center z-10 relative">
        <h3 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-primary" /> News Bulletin
        </h3>
        <span className="text-[10px] text-slate-500 font-data-mono">
          {currentIndex + 1} / {articles.length}
        </span>
      </div>
      
      <div className="flex-1 p-lg relative overflow-hidden flex items-center justify-center">
        <div 
          key={currentIndex} 
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center w-full"
        >
          <a href={article.url} target="_blank" rel="noreferrer" className="block group">
            <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-primary transition-colors line-clamp-3 mb-2 leading-relaxed">
              {article.title}
            </h4>
            <div className="flex items-center justify-center gap-3 text-[10px]">
              <span className="text-slate-400 font-medium truncate max-w-[120px]">{article.source}</span>
              {article.badge && <span>{article.badge}</span>}
              <span className="text-slate-400 font-data-mono">{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </a>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-surface-container-high absolute bottom-0 left-0">
        <div 
          key={`progress-${currentIndex}`}
          className="h-full bg-primary" 
          style={{ animation: 'progress 5s linear forwards' }}
        />
      </div>
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default NewsBulletinBox;
