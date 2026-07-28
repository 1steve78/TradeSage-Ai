import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllocation } from '../../services/analyticsApi';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded shadow-none">
        <p className="font-title-sm text-[#0f172a] font-bold mb-1">
          {data.companyName} <span className="font-body-sm text-slate-500 font-normal">({data.symbol})</span>
        </p>
        <p className="font-data-mono text-[#0f172a] font-medium">Value: ₹{data.value.toLocaleString()}</p>
        <p className="font-data-mono text-[#0f172a] font-medium">Allocation: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const AssetAllocationChart = ({ data = [] }) => {
  const allocation = data;

  if (allocation.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-96 flex items-center justify-center">
        <p className="font-body-sm text-slate-500 font-medium">No assets found in portfolio</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-full flex flex-col">
      <h3 className="font-title-sm text-[#0f172a] font-bold mb-4">
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
                  style={{ filter: 'none' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend 
              verticalAlign="bottom" 
              height={40}
              iconType="circle"
              formatter={(value, entry, index) => (
                <span className="font-body-sm text-[#0f172a] ml-1 font-medium">
                  {allocation[index].symbol} <span className="font-data-mono text-slate-500 ml-1">({allocation[index].percentage}%)</span>
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
