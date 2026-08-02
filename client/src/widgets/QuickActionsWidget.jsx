import React from "react";

const QuickActionsWidget = () => {
    return (
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-sm">
            <button className="flex flex-col items-center justify-center bg-primary text-on-primary p-lg rounded-lg hover:opacity-90 transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-[32px] mb-xs">shopping_cart</span>
                <span className="font-label-caps text-xs">BUY</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant p-lg rounded-lg hover:bg-surface-container-high transition-all active:scale-95">
                <span className="material-symbols-outlined text-[32px] mb-xs text-loss">sell</span>
                <span className="font-label-caps text-xs">SELL</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant p-lg rounded-lg hover:bg-surface-container-high transition-all active:scale-95">
                <span className="material-symbols-outlined text-[32px] mb-xs text-secondary">visibility</span>
                <span className="font-label-caps text-xs">WATCHLIST</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-fixed p-lg rounded-lg hover:opacity-90 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[32px] mb-xs">psychology</span>
                <span className="font-label-caps text-xs">AI ASSISTANT</span>
            </button>
            <button className="col-span-2 flex items-center justify-center gap-md bg-surface-container-lowest border border-outline-variant p-md rounded-lg hover:bg-surface-container-high transition-all active:scale-95">
                <span className="material-symbols-outlined text-secondary">manage_search</span>
                <span className="font-label-caps text-xs">ADVANCED SCANNER</span>
            </button>
        </div>
    );
};

export default QuickActionsWidget;
