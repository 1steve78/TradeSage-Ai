import React from 'react';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

const AnalyticsPage = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto font-sans h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
          Portfolio Analytics
        </h1>
        <p className="text-slate-500 mt-1">Deep insights into your portfolio's performance and health.</p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
};

export default AnalyticsPage;
