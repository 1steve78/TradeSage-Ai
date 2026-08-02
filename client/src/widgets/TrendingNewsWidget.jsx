import React from "react";
import Widget from "../components/Dashboard/Widget";

const TrendingNewsWidget = ({ news, loading }) => {
    const headerRight = (
        <span className="font-label-caps text-[10px] text-outline">AUTO-REFRESH: 60S</span>
    );

    return (
        <div className="col-span-12 lg:col-span-8">
            <Widget title="Trending News" headerRight={headerRight} loading={loading} className="h-full">
                <div className="space-y-lg h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {news && news.length > 0 ? (
                        news.slice(0, 5).map((article, i) => (
                            <div key={i} className="flex gap-md group cursor-pointer" onClick={() => window.open(article.url, '_blank')}>
                                <div className="w-20 h-16 bg-surface-container rounded shrink-0 overflow-hidden border border-outline-variant flex items-center justify-center text-outline">
                                    <span className="material-symbols-outlined">feed</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-body-md group-hover:text-primary transition-colors line-clamp-1">{article.headline}</h4>
                                    <p className="text-body-sm text-on-surface-variant line-clamp-1">{article.summary || "No summary available"}</p>
                                    <div className="flex items-center gap-md mt-sm">
                                        <span className="font-label-caps text-[10px] px-sm py-xs bg-surface-container rounded">{article.source.toUpperCase()}</span>
                                        <span className="font-label-caps text-[10px] text-outline">
                                            {new Date(article.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-outline mt-10">No trending news right now.</div>
                    )}
                </div>
            </Widget>
        </div>
    );
};

export default TrendingNewsWidget;
