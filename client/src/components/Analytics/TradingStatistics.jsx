import React from 'react';

const TradingStatistics = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-full flex flex-col">
      <h3 className="font-title-sm text-[#0f172a] font-bold mb-4">
        Trading Statistics
      </h3>
      <div className="flex-grow grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Total Trades</p>
          <p className="font-data-mono text-2xl font-medium text-[#0f172a]">{stats.totalTrades || 0}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Win Rate</p>
          <p className={`font-data-mono text-2xl font-medium ${stats.winRate >= 50 ? 'text-emerald-600' : 'text-orange-600'}`}>
            {stats.winRate || 0}%
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Winning</p>
          <p className="font-data-mono text-xl font-medium text-emerald-600">{stats.winningTrades || 0}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
          <p className="font-body-sm text-slate-500 mb-1">Losing</p>
          <p className="font-data-mono text-xl font-medium text-rose-600">{stats.losingTrades || 0}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant col-span-2 flex justify-between items-center">
          <div>
            <p className="font-body-sm text-slate-500 mb-1">Average Profit</p>
            <p className="font-data-mono text-lg font-medium text-emerald-600">₹{stats.averageProfit?.toLocaleString() || 0}</p>
          </div>
          <div className="w-px h-10 bg-outline-variant/40"></div>
          <div className="text-right">
            <p className="font-body-sm text-slate-500 mb-1">Average Loss</p>
            <p className="font-data-mono text-lg font-medium text-rose-600">₹{stats.averageLoss?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingStatistics;
