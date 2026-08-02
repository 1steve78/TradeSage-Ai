import React from "react";
import { Link } from "react-router-dom";

const EmptyDashboardState = ({ morningBrief }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant rounded-lg p-xl text-center py-20 mt-lg">
            <h1 className="font-display-lg text-[32px] font-black text-primary mb-2">
                {morningBrief?.greeting || "Welcome to TradeSage AI!"}
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-lg">
                {morningBrief?.summary || "It looks like you're just getting started. TradeSage AI is your intelligent co-pilot for the markets."}
            </p>
            
            <div className="flex flex-col gap-sm w-full max-w-sm mx-auto text-left">
                <Link to="/explorer" className="flex items-center gap-md p-md bg-surface-container rounded-lg border border-outline-variant hover:border-primary hover:text-primary transition-colors group">
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">manage_search</span>
                    <div>
                        <h4 className="font-bold text-sm">Explore the Market</h4>
                        <p className="text-xs text-outline group-hover:text-primary/70">Find stocks to trade or watch</p>
                    </div>
                </Link>
                <Link to="/scanner" className="flex items-center gap-md p-md bg-surface-container rounded-lg border border-outline-variant hover:border-primary hover:text-primary transition-colors group">
                    <span className="material-symbols-outlined text-gain group-hover:text-primary transition-colors">radar</span>
                    <div>
                        <h4 className="font-bold text-sm">AI Market Scanner</h4>
                        <p className="text-xs text-outline group-hover:text-primary/70">Discover technical & fundamental opportunities</p>
                    </div>
                </Link>
                <button className="flex items-center gap-md p-md bg-primary-container text-on-primary-fixed rounded-lg border border-primary/20 hover:opacity-90 transition-opacity text-left">
                    <span className="material-symbols-outlined text-primary">psychology</span>
                    <div>
                        <h4 className="font-bold text-sm">Ask AI Assistant</h4>
                        <p className="text-xs opacity-70">Get started with a question</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default EmptyDashboardState;
