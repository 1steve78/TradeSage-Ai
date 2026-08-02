import React from "react";
import ScoreBadge from "./ScoreBadge";

const ScannerCard = ({ data, onViewDetails }) => {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg hover:border-primary transition-colors group">
            <div className="flex justify-between items-start mb-md">
                <div>
                    <h3 className="font-display-lg text-[20px] font-black group-hover:text-primary transition-colors">{data.symbol}</h3>
                    <p className="text-body-sm text-outline">{data.companyName}</p>
                </div>
                <ScoreBadge score={data.score} />
            </div>

            <div className="flex gap-lg mb-md">
                <div>
                    <p className="font-label-caps text-[10px] text-outline">PRICE</p>
                    <p className="font-data-mono text-sm font-bold">₹{data.price}</p>
                </div>
                <div>
                    <p className="font-label-caps text-[10px] text-outline">CHANGE</p>
                    <p className={`font-data-mono text-sm font-bold ${data.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {data.change >= 0 ? '+' : ''}{data.change}%
                    </p>
                </div>
                <div>
                    <p className="font-label-caps text-[10px] text-outline">VOLUME</p>
                    <p className="font-data-mono text-sm">{(data.volume / 100000).toFixed(1)}L</p>
                </div>
            </div>

            <div className="mb-md">
                <div className="flex items-center gap-xs">
                    <span className={`w-2 h-2 rounded-full ${data.sentiment === 'Bullish' || data.sentiment === 'Slightly Bullish' ? 'bg-gain' : data.sentiment === 'Bearish' || data.sentiment === 'Slightly Bearish' ? 'bg-loss' : 'bg-secondary'}`}></span>
                    <span className="font-label-caps text-[11px] text-on-surface-variant font-bold uppercase">{data.sentiment}</span>
                </div>
            </div>

            {data.reasons && data.reasons.length > 0 && (
                <div className="space-y-1 mb-md">
                    {data.reasons.map((reason, i) => (
                        <div key={i} className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-gain text-[14px]">check</span>
                            <span className="text-body-sm text-on-surface-variant">{reason}</span>
                        </div>
                    ))}
                </div>
            )}

            <button 
                onClick={() => onViewDetails && onViewDetails(data.symbol)}
                className="w-full mt-auto py-sm border border-outline-variant text-on-surface-variant font-label-caps text-[11px] rounded hover:bg-surface-container-high transition-colors font-bold tracking-wider">
                VIEW DETAILS
            </button>
        </div>
    );
};

export default ScannerCard;
