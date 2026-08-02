import React from "react";
import Widget from "../components/Dashboard/Widget";

const MarketHeatWidget = ({ loading }) => {
    return (
        <div className="col-span-12 lg:col-span-4 h-full">
            <Widget title="Market Heat" loading={loading} className="h-full">
                <div className="grid grid-cols-2 gap-xs h-64">
                    <div className="bg-gain rounded p-sm flex flex-col justify-end text-white relative overflow-hidden">
                        <span className="font-bold text-xs z-10">TECH</span>
                        <span className="text-[10px] opacity-80 z-10">+2.45%</span>
                        <div className="absolute inset-0 bg-black/10 opacity-50 hover:opacity-0 transition-opacity cursor-pointer"></div>
                    </div>
                    <div className="grid grid-rows-2 gap-xs">
                        <div className="bg-gain/60 rounded p-sm flex flex-col justify-end text-white hover:bg-gain transition-colors cursor-pointer">
                            <span className="font-bold text-xs">FIN</span>
                            <span className="text-[10px] opacity-80">+0.82%</span>
                        </div>
                        <div className="bg-loss/80 rounded p-sm flex flex-col justify-end text-white hover:bg-loss transition-colors cursor-pointer">
                            <span className="font-bold text-xs">ENGY</span>
                            <span className="text-[10px] opacity-80">-1.12%</span>
                        </div>
                    </div>
                    <div className="bg-loss/40 rounded p-sm flex flex-col justify-end text-on-surface hover:bg-loss/60 transition-colors cursor-pointer">
                        <span className="font-bold text-xs">HLTH</span>
                        <span className="text-[10px] opacity-80">-0.21%</span>
                    </div>
                    <div className="bg-gain/20 rounded p-sm flex flex-col justify-end text-on-surface hover:bg-gain/40 transition-colors cursor-pointer">
                        <span className="font-bold text-xs">UTIL</span>
                        <span className="text-[10px] opacity-80">+0.15%</span>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

export default MarketHeatWidget;
