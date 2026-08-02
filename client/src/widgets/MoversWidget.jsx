import React from "react";
import Widget from "../components/Dashboard/Widget";

const MoversWidget = ({ market, loading }) => {
    // We will use stub data if real market data isn't available yet for movers
    const gainers = market?.topGainers || [
        { symbol: "PLTR", change: "+8.42%" },
        { symbol: "SQ", change: "+5.11%" },
        { symbol: "AMD", change: "+4.89%" }
    ];
    
    const losers = market?.topLosers || [
        { symbol: "WBA", change: "-4.21%" },
        { symbol: "PYPL", change: "-3.85%" },
        { symbol: "DIS", change: "-2.91%" }
    ];

    return (
        <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-gutter h-[350px]">
            <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex flex-col">
                <h4 className="font-label-caps text-[11px] text-gain font-bold mb-sm">TOP GAINERS</h4>
                <div className="space-y-sm overflow-y-auto custom-scrollbar flex-1">
                    {gainers.map((g, i) => (
                        <div key={i} className="flex justify-between items-center px-sm py-xs bg-gain/5 rounded">
                            <span className="font-data-mono text-sm">{g.symbol}</span>
                            <span className="font-data-mono text-gain text-sm">{g.change}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex flex-col">
                <h4 className="font-label-caps text-[11px] text-loss font-bold mb-sm">TOP LOSERS</h4>
                <div className="space-y-sm overflow-y-auto custom-scrollbar flex-1">
                    {losers.map((l, i) => (
                        <div key={i} className="flex justify-between items-center px-sm py-xs bg-loss/5 rounded">
                            <span className="font-data-mono text-sm">{l.symbol}</span>
                            <span className="font-data-mono text-loss text-sm">{l.change}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoversWidget;
