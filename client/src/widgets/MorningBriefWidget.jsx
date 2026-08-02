import React from "react";
import { Link } from "react-router-dom";

const MorningBriefWidget = ({ morningBrief, loading }) => {
    if (loading) {
        return (
            <div className="col-span-12 bg-primary/5 border border-primary/20 rounded-xl p-lg md:p-xl flex flex-col md:flex-row gap-lg animate-pulse mb-lg">
                <div className="flex-1">
                    <div className="h-8 w-64 bg-primary/10 rounded mb-4"></div>
                    <div className="h-4 w-full max-w-2xl bg-outline-variant/30 rounded mb-2"></div>
                    <div className="h-4 w-full max-w-xl bg-outline-variant/30 rounded"></div>
                </div>
            </div>
        );
    }

    if (!morningBrief) return null;

    return (
        <div className="col-span-12 bg-gradient-to-r from-surface-container-lowest to-primary/5 border border-primary/20 rounded-xl p-lg md:p-xl flex flex-col lg:flex-row gap-lg mb-lg shadow-sm relative overflow-hidden group">
            {/* Background Decoration */}
            <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[180px] text-primary/5 rotate-[-15deg] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                auto_awesome
            </span>

            <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-sm">
                    <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                    <span className="font-label-caps text-[10px] text-primary font-bold tracking-widest uppercase">
                        AI Morning Brief
                    </span>
                </div>
                
                <h2 className="font-display-lg text-[24px] md:text-[28px] font-black text-on-surface mb-md">
                    {morningBrief.greeting}
                </h2>
                
                <p className="text-body-md text-on-surface-variant max-w-3xl mb-md leading-relaxed">
                    {morningBrief.summary}
                </p>
                
                <div className="inline-flex items-center gap-sm bg-white/60 border border-primary/20 px-md py-xs rounded text-sm text-slate-700 shadow-xs font-medium">
                    <span className="material-symbols-outlined text-secondary text-[18px]">lightbulb</span>
                    {morningBrief.action}
                </div>
            </div>
            
            <div className="w-full lg:w-64 shrink-0 flex flex-col justify-center relative z-10 border-t lg:border-t-0 lg:border-l border-outline-variant/50 pt-md lg:pt-0 lg:pl-lg">
                <h4 className="font-label-caps text-[10px] text-outline mb-sm">QUICK ACTIONS</h4>
                <div className="grid grid-cols-2 gap-2">
                    <Link to="/explorer" className="flex items-center justify-center gap-1 bg-white border border-outline-variant py-2 rounded text-xs font-bold hover:bg-surface-container-high transition-colors shadow-sm">
                        <span className="text-gain">BUY</span>
                    </Link>
                    <Link to="/portfolio" className="flex items-center justify-center gap-1 bg-white border border-outline-variant py-2 rounded text-xs font-bold hover:bg-surface-container-high transition-colors shadow-sm">
                        <span className="text-loss">SELL</span>
                    </Link>
                    <Link to="/scanner" className="col-span-2 flex items-center justify-center gap-2 bg-primary text-on-primary py-2 rounded text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">radar</span>
                        MARKET SCANNER
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MorningBriefWidget;
