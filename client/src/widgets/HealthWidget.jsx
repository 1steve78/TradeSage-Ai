import React from "react";
import Widget from "../components/Dashboard/Widget";

const HealthWidget = ({ aiData, loading }) => {
    const score = aiData?.health?.score || 0;
    
    return (
        <div className="col-span-12 lg:col-span-4">
            <Widget loading={loading} className="h-full flex flex-col items-center justify-center relative overflow-hidden" noPadding>
                <div className="p-lg w-full flex flex-col items-center">
                    <h3 className="font-label-caps text-label-caps text-secondary mb-md w-full text-left">PORTFOLIO HEALTH SCORE</h3>
                    <div className="relative w-32 h-32 mb-sm flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                            <circle className="text-outline-variant" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                            <circle 
                                className={score >= 80 ? "text-gain" : score >= 60 ? "text-yellow-500" : "text-loss"} 
                                cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" 
                                strokeDasharray="364.4" 
                                strokeDashoffset={364.4 - (364.4 * score) / 100} 
                                strokeWidth="8"
                                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                            ></circle>
                        </svg>
                        <div className="flex flex-col items-center justify-center z-10 relative mt-2">
                            <span className="font-display-lg text-[28px] font-black leading-none">{score}</span>
                            <span className="font-label-caps text-[10px] text-outline mt-1">{score >= 80 ? 'OPTIMAL' : score >= 60 ? 'MODERATE' : 'NEEDS ATTENTION'}</span>
                        </div>
                    </div>
                    <p className="text-body-sm text-center text-on-surface-variant mt-2">
                        {aiData?.insight || "Your current allocation is well-balanced."}
                    </p>
                </div>
            </Widget>
        </div>
    );
};

export default HealthWidget;
