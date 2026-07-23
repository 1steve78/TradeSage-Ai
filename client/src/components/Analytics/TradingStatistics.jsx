import React from 'react';

const TradingStatistics = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 h-full group flex flex-col">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block group-hover:scale-105 transition-transform origin-left">
        Trading Statistics
      </h3>
      <div className="flex-grow grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{stats.totalTrades || 0}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1">Win Rate</p>
          <p className={`text-2xl font-bold ${stats.winRate >= 50 ? 'text-emerald-400' : 'text-orange-400'}`}>
            {stats.winRate || 0}%
          </p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1 text-emerald-400/80">Winning</p>
          <p className="text-xl font-bold text-emerald-400">{stats.winningTrades || 0}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm font-medium mb-1 text-red-400/80">Losing</p>
          <p className="text-xl font-bold text-red-400">{stats.losingTrades || 0}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 col-span-2 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1 text-emerald-400/80">Average Profit</p>
            <p className="text-lg font-bold text-emerald-400">₹{stats.averageProfit?.toLocaleString() || 0}</p>
          </div>
          <div className="w-px h-10 bg-slate-700"></div>
          <div className="text-right">
            <p className="text-slate-400 text-sm font-medium mb-1 text-red-400/80">Average Loss</p>
            <p className="text-lg font-bold text-red-400">₹{stats.averageLoss?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingStatistics;
