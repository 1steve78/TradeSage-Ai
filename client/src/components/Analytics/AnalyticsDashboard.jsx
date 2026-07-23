import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getDashboardAnalytics } from '../../services/analyticsApi';
import PortfolioSummaryCard from './PortfolioSummaryCard';
import PortfolioGrowthChart from './PortfolioGrowthChart';
import AssetAllocationChart from './AssetAllocationChart';
import SectorAllocationChart from './SectorAllocationChart';
import PerformanceCards from './PerformanceCards';
import TradingStatistics from './TradingStatistics';
import PortfolioHealthCard from './PortfolioHealthCard';

const EmptyState = () => (
  <div className="border border-slate-200 rounded-xl min-h-[400px] py-16 px-6 relative overflow-hidden w-full shadow-sm bg-slate-50">
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }}
    />
    <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '512px', margin: '0 auto', textAlign: 'center' }}>
      <div className="mb-8 text-slate-300 flex justify-center">
        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
          <path d="M4 17l4-4 4 4 8-8" opacity="0.5" strokeDasharray="2 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
        </svg>
      </div>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.025em', width: '100%' }}>
        Ready to build your portfolio?
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem', width: '100%' }}>
        Connect your brokerage account or manually add assets to unlock deep performance analytics and AI-driven insights.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/settings/broker"
          className="text-center bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
        >
          Link Your Broker
        </Link>
        <Link
          to="/portfolio/add"
          className="text-center bg-white border border-slate-200 text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          Add First Asset
        </Link>
      </div>
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const { data: rawResponse, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: getDashboardAnalytics,
    staleTime: 60000
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('[AnalyticsDashboard] query error:', error);
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Failed to load analytics data. Please try again.
      </div>
    );
  }

  // Normalize: accept either { summary, allocation, ... } directly,
  // or a wrapped { success, data: { summary, allocation, ... } } shape.
  const data = rawResponse?.data && !rawResponse?.summary && !rawResponse?.allocation
    ? rawResponse.data
    : rawResponse;

  // TEMP DEBUG — check your browser console for the actual shape.
  // Remove this once the data issue is confirmed fixed.
  console.log('[AnalyticsDashboard] raw response:', rawResponse);
  console.log('[AnalyticsDashboard] normalized data:', data);

  const hasAllocation = Array.isArray(data?.allocation) && data.allocation.length > 0;
  const hasSectors = Array.isArray(data?.sectors) && data.sectors.length > 0;

  if (!data || (!hasAllocation && !hasSectors)) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6 text-slate-900 w-full">
      <div className="w-full">
        <PortfolioSummaryCard summary={data.summary} />
      </div>

      <div className="w-full">
        <PortfolioGrowthChart growthData={data.growth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetAllocationChart data={data.allocation} />
        <SectorAllocationChart data={data.sectors} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceCards best={data.performance?.bestPerformer} worst={data.performance?.worstPerformer} />
        <TradingStatistics stats={data.statistics} />
      </div>

      <div className="w-full">
        <PortfolioHealthCard summary={data.summary} sectors={data.sectors} statistics={data.statistics} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;