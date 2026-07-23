import React from 'react';

const PortfolioSummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col justify-between h-full group">
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block group-hover:scale-105 transition-transform origin-left">
        Portfolio Summary
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1">Portfolio Value</p>
          <p className="text-2xl font-bold text-white">₹{summary.portfolioValue?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1">Today's P&L</p>
          <p className={`text-xl font-bold ${summary.todaysPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {summary.todaysPnL >= 0 ? '+' : ''}₹{summary.todaysPnL?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1">Overall P&L</p>
          <p className={`text-xl font-bold ${summary.overallPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {summary.overallPnL >= 0 ? '+' : ''}₹{summary.overallPnL?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1">ROI</p>
          <p className={`text-xl font-bold ${summary.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {summary.roi >= 0 ? '+' : ''}{summary.roi?.toFixed(2) || 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
