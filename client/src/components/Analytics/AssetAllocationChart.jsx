import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllocation } from '../../services/analyticsApi';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl">
        <p className="text-slate-200 font-semibold mb-1">
          {data.companyName} <span className="text-slate-400 text-sm">({data.symbol})</span>
        </p>
        <p className="text-blue-400 font-medium">Value: ₹{data.value.toLocaleString()}</p>
        <p className="text-purple-400 font-medium">Allocation: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const AssetAllocationChart = ({ data = [] }) => {
  const allocation = data;

  if (allocation.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 h-96 flex items-center justify-center">
        <p className="text-slate-400 font-medium">No assets found in portfolio</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group h-full">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block group-hover:scale-105 transition-transform origin-left">
        Asset Allocation
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocation}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {allocation.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer outline-none"
                  style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend 
              verticalAlign="bottom" 
              height={40}
              iconType="circle"
              formatter={(value, entry, index) => (
                <span className="text-slate-300 ml-1 font-medium">
                  {allocation[index].symbol} <span className="text-slate-500 ml-1">({allocation[index].percentage}%)</span>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetAllocationChart;
