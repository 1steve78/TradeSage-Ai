import React from "react";
import Widget from "../components/Dashboard/Widget";

const PortfolioWidget = ({ portfolio, loading }) => {
    return (
        <div className="col-span-12 lg:col-span-8">
            <Widget loading={loading} className="h-full">
                <div className="flex justify-between items-start mb-md">
                    <div>
                        <h3 className="font-label-caps text-label-caps text-secondary">TOTAL PORTFOLIO VALUE</h3>
                        <p className="font-display-lg text-display-lg font-black mt-xs">
                            ₹{portfolio?.portfolioValue?.toLocaleString() || "0"} 
                            <span className={`text-title-sm ml-sm font-bold ${portfolio?.roi >= 0 ? 'text-gain' : 'text-loss'}`}>
                                {portfolio?.roi >= 0 ? '+' : ''}{portfolio?.roi?.toFixed(2) || 0}%
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-md">
                        <div className="text-right">
                            <p className="font-label-caps text-[10px] text-outline">TODAY'S P&L</p>
                            <p className={`font-data-mono ${portfolio?.todaysPnL >= 0 ? 'text-gain' : 'text-loss'}`}>
                                {portfolio?.todaysPnL >= 0 ? '+' : ''}₹{portfolio?.todaysPnL?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-label-caps text-[10px] text-outline">AVAILABLE CASH</p>
                            <p className="font-data-mono text-on-surface">₹{portfolio?.cash?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-md pt-md border-t border-outline-variant">
                    <div>
                        <p className="font-label-caps text-[10px] text-outline">INVESTED VALUE</p>
                        <p className="font-data-mono text-sm">₹{portfolio?.investedValue?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                        <p className="font-label-caps text-[10px] text-outline">OVERALL P&L</p>
                        <p className={`font-data-mono text-sm ${portfolio?.overallPnL >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {portfolio?.overallPnL >= 0 ? '+' : ''}₹{portfolio?.overallPnL?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div>
                        <p className="font-label-caps text-[10px] text-outline">HOLDINGS</p>
                        <p className="font-data-mono text-sm">{portfolio?.holdings?.length || 0}</p>
                    </div>
                    <div>
                        <p className="font-label-caps text-[10px] text-outline">PORTFOLIO ROI</p>
                        <p className={`font-data-mono text-sm ${portfolio?.roi >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {portfolio?.roi >= 0 ? '+' : ''}{portfolio?.roi?.toFixed(2) || 0}%
                        </p>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

export default PortfolioWidget;
