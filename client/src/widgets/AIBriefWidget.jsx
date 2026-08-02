import React from "react";
import Widget from "../components/Dashboard/Widget";

const AIBriefWidget = ({ aiData, loading }) => {
    const headerRight = (
        <div className="flex items-center gap-xs px-sm py-xs bg-gain/10 rounded-full">
            <span className="material-symbols-outlined text-gain text-[14px]">trending_up</span>
            <span className="font-label-caps text-[10px] text-gain font-bold uppercase">Bullish</span>
        </div>
    );

    return (
        <div className="col-span-12 lg:col-span-4 h-[350px]">
            <Widget title="Morning Brief" headerRight={headerRight} loading={loading} className="h-full">
                <div className="space-y-md overflow-y-auto pr-sm custom-scrollbar h-full pb-4">
                    <div className="border-l-2 border-primary pl-md py-xs">
                        <p className="font-label-caps text-[11px] text-secondary">AI INSIGHT</p>
                        <p className="text-body-sm mt-xs text-on-surface-variant">
                            {aiData?.insight || "No AI insight available yet."}
                        </p>
                    </div>
                    {/* Hardcoded placeholders for structure */}
                    <div className="border-l-2 border-outline-variant pl-md py-xs">
                        <p className="font-label-caps text-[11px] text-secondary">MARKET SENTIMENT</p>
                        <p className="text-body-sm mt-xs text-on-surface-variant">CPI data coming in lower than expected; bond yields cooling down.</p>
                    </div>
                    <div className="border-l-2 border-outline-variant pl-md py-xs">
                        <p className="font-label-caps text-[11px] text-secondary">TOP ALERT</p>
                        <p className="text-body-sm mt-xs text-on-surface-variant">NVDA earnings tonight. High volatility expected in your Tech holdings.</p>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

export default AIBriefWidget;
