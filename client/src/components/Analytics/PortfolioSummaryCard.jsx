import React from 'react';

const PortfolioSummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-full flex flex-col justify-between">
      <h3 className="font-title-sm text-[#0f172a] font-bold mb-4">
        Portfolio Summary
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Portfolio Value</p>
          <p className="font-data-mono text-2xl font-medium text-[#0f172a]">₹{summary.portfolioValue?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Today's P&L</p>
          <p className={`font-data-mono text-xl font-medium ${summary.todaysPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.todaysPnL >= 0 ? '+' : ''}₹{summary.todaysPnL?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Overall P&L</p>
          <p className={`font-data-mono text-xl font-medium ${summary.overallPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.overallPnL >= 0 ? '+' : ''}₹{summary.overallPnL?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">ROI</p>
          <p className={`font-data-mono text-xl font-medium ${summary.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.roi >= 0 ? '+' : ''}{summary.roi?.toFixed(2) || 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
