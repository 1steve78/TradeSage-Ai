import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PerformanceCards = ({ best, worst }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Best Performer */}
      <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant shadow-none flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4 pb-sm border-b border-outline-variant/40">
          <h3 className="font-title-sm text-[#0f172a] font-bold">
            🏆 Best Performer
          </h3>
          <div className="p-1">
            <TrendingUp className="text-emerald-600" size={20} />
          </div>
        </div>
        
        {best?.symbol ? (
          <div>
            <p className="font-title-sm text-[#0f172a] font-bold mb-1">{best.symbol}</p>
            <p className="font-data-mono text-2xl font-medium text-emerald-600">
              +{best.percentage}%
            </p>
            <p className="font-data-mono text-emerald-700 text-sm mt-1">
              +₹{best.pnl?.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center font-body-sm text-slate-500">
            No data available
          </div>
        )}
      </div>

      {/* Worst Performer */}
      <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant shadow-none flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4 pb-sm border-b border-outline-variant/40">
          <h3 className="font-title-sm text-[#0f172a] font-bold">
            📉 Worst Performer
          </h3>
          <div className="p-1">
            <TrendingDown className="text-rose-600" size={20} />
          </div>
        </div>
        
        {worst?.symbol ? (
          <div>
            <p className="font-title-sm text-[#0f172a] font-bold mb-1">{worst.symbol}</p>
            <p className="font-data-mono text-2xl font-medium text-rose-600">
              {worst.percentage}%
            </p>
            <p className="font-data-mono text-rose-700 text-sm mt-1">
              {worst.pnl < 0 ? '-' : ''}₹{Math.abs(worst.pnl || 0).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center font-body-sm text-slate-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCards;
