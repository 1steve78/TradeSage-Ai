import React from "react";

const ScoreBadge = ({ score }) => {
    let colorClass = "bg-primary text-on-primary";
    let text = "STRONG";

    if (score >= 80) {
        colorClass = "bg-gain/20 text-gain border border-gain/30";
        text = "STRONG BUY";
    } else if (score >= 60) {
        colorClass = "bg-blue-500/20 text-blue-500 border border-blue-500/30";
        text = "OPPORTUNITY";
    } else if (score >= 40) {
        colorClass = "bg-surface-container-high text-on-surface border border-outline-variant";
        text = "NEUTRAL";
    } else {
        colorClass = "bg-loss/20 text-loss border border-loss/30";
        text = "WEAK";
    }

    return (
        <div className="flex flex-col items-end">
            <span className="font-display-lg text-[24px] font-black leading-none">{score}</span>
            <span className={`font-label-caps text-[9px] px-sm py-xs rounded mt-1 font-bold ${colorClass}`}>
                {text}
            </span>
        </div>
    );
};

export default ScoreBadge;
