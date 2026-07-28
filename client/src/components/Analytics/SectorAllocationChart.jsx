import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getSectorDistribution } from '../../services/analyticsApi';

const COLORS = ['#8b5cf6', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899', '#10b981', '#f43f5e', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded shadow-none">
        <p className="font-title-sm text-[#0f172a] font-bold mb-1">{data.sector}</p>
        <p className="font-data-mono text-[#0f172a] font-medium">Value: ₹{data.value.toLocaleString()}</p>
        <p className="font-data-mono text-[#0f172a] font-medium">Allocation: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const SectorAllocationChart = ({ data = [] }) => {
  const distribution = data;

  if (distribution.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-96 flex items-center justify-center">
        <p className="font-body-sm text-slate-500 font-medium">No sector data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-full flex flex-col">
      <h3 className="font-title-sm text-[#0f172a] font-bold mb-4">
        Sector Allocation
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
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
              {distribution.map((entry, index) => (
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
                  {distribution[index].sector} <span className="font-data-mono text-slate-500 ml-1">({distribution[index].percentage}%)</span>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SectorAllocationChart;
