import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Newspaper } from "lucide-react";

const NewsBulletinTicker = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await api.get("/news/market?category=general");
        if (data?.success && data?.data) {
          setNews(data.data.slice(0, 15)); // Take top 15 news items for ticker
        }
      } catch (err) {
        console.error("Failed to fetch bulletin news:", err);
      }
    };

    fetchNews();
    // Fetch every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (news.length === 0) return null;

  return (
    <div className="w-full bg-[#f1f5f9] py-1.5 overflow-hidden border-b border-outline-variant flex items-center relative">
      {/* Fixed Header Label on the left */}
      <div className="absolute left-0 top-0 bottom-0 px-3 flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-wider bg-gradient-to-r from-[#f1f5f9] via-[#f1f5f9] to-transparent pr-8 z-10">
        <Newspaper className="w-3.5 h-3.5" /> 
        <span className="hidden sm:inline">Bulletin</span>
      </div>
      
      {/* Ticker Content */}
      <div className="flex-1 overflow-hidden ml-24 sm:ml-32">
        <div className="ticker-scroll flex items-center gap-8 whitespace-nowrap">
          {news.concat(news).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
              <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                {item.title}
              </a>
              {item.badge && <span className="text-[10px] ml-1">{item.badge}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsBulletinTicker;
