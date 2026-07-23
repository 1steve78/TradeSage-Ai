import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PerformanceCards = ({ best, worst }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Best Performer */}
      <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            🏆 Best Performer
          </h3>
          <div className="p-2 bg-emerald-500/20 rounded-full group-hover:scale-110 transition-transform">
            <TrendingUp className="text-emerald-400" size={24} />
          </div>
        </div>
        
        {best?.symbol ? (
          <div>
            <p className="text-3xl font-bold text-white mb-2">{best.symbol}</p>
            <p className="text-2xl font-bold text-emerald-400">
              +{best.percentage}%
            </p>
            <p className="text-emerald-500/70 text-sm mt-1">
              +₹{best.pnl?.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-slate-500">
            No data available
          </div>
        )}
      </div>

      {/* Worst Performer */}
      <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-red-500/10 transition-all duration-500 group flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            📉 Worst Performer
          </h3>
          <div className="p-2 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform">
            <TrendingDown className="text-red-400" size={24} />
          </div>
        </div>
        
        {worst?.symbol ? (
          <div>
            <p className="text-3xl font-bold text-white mb-2">{worst.symbol}</p>
            <p className="text-2xl font-bold text-red-400">
              {worst.percentage}%
            </p>
            <p className="text-red-500/70 text-sm mt-1">
              {worst.pnl < 0 ? '-' : ''}₹{Math.abs(worst.pnl || 0).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-slate-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCards;
