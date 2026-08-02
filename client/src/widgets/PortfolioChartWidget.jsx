import React from "react";
import Widget from "../components/Dashboard/Widget";

const PortfolioChartWidget = ({ loading }) => {
    return (
        <div className="col-span-12 lg:col-span-8">
            <Widget loading={loading} className="h-full" noPadding>
                <div className="p-lg h-full flex flex-col">
                    <div className="flex justify-between items-center mb-lg">
                        <div className="flex gap-md">
                            <button className="font-label-caps text-xs px-md py-xs bg-primary text-on-primary rounded">PERFORMANCE</button>
                            <button className="font-label-caps text-xs px-md py-xs hover:bg-surface-container-high rounded transition-colors">DRAWDOWN</button>
                        </div>
                        <div className="flex gap-xs bg-surface-container px-xs py-xs rounded">
                            <button className="px-sm py-xs text-[10px] font-bold hover:bg-white rounded">1D</button>
                            <button className="px-sm py-xs text-[10px] font-bold hover:bg-white rounded">1W</button>
                            <button className="px-sm py-xs text-[10px] font-bold hover:bg-white rounded">1M</button>
                            <button className="px-sm py-xs text-[10px] font-bold hover:bg-white rounded">YTD</button>
                            <button className="px-sm py-xs text-[10px] font-bold bg-white shadow-sm rounded">ALL</button>
                        </div>
                    </div>
                    
                    <div className="h-64 flex items-end gap-1 relative mt-auto">
                        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-full h-[60%] border-b-2 border-primary relative overflow-hidden">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                                    <path d="M0,80 Q100,20 200,60 T400,40 T600,70 T800,10 T1000,30" fill="none" stroke="black" strokeWidth="2"></path>
                                    <path d="M0,80 Q100,20 200,60 T400,40 T600,70 T800,10 T1000,30 V100 H0 Z" fill="rgba(0,0,0,0.05)"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

export default PortfolioChartWidget;
