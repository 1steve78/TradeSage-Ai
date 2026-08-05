import React from 'react';

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

export const SkeletonDashboard = () => (
  <div className="p-6 space-y-6">
    <div className="h-8 w-48 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-24 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 h-96 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      <div className="h-96 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    </div>
  </div>
);

export const SkeletonPortfolio = () => (
  <div className="p-6 space-y-6 max-w-[1280px] mx-auto">
    <div className="flex justify-between">
      <div className="h-10 w-64 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      <div className="h-10 w-32 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    </div>
    <div className="h-32 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    <div className="h-64 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
  </div>
);

export const SkeletonOrders = () => (
  <div className="p-6 space-y-6 max-w-[1280px] mx-auto">
    <div className="h-8 w-48 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    <div className="h-10 w-full bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 w-full bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      ))}
    </div>
  </div>
);

export const SkeletonNews = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 p-4 border rounded">
        <div className="w-24 h-24 bg-slate-200 rounded flex-shrink-0 relative overflow-hidden"><Shimmer /></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/4 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
          <div className="h-6 w-3/4 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
          <div className="h-4 w-full bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonScanner = () => (
  <div className="p-6 space-y-6">
    <div className="h-8 w-48 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    <div className="h-16 w-full bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-48 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      ))}
    </div>
  </div>
);

export const SkeletonAI = () => (
  <div className="p-6 space-y-6">
    <div className="flex justify-between border-b pb-4">
      <div className="h-8 w-64 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      <div className="h-8 w-24 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 h-64 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
      <div className="md:col-span-4 h-64 bg-slate-200 rounded relative overflow-hidden"><Shimmer /></div>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50">
    {Icon && <div className="p-4 bg-slate-200 rounded-full text-slate-500 mb-4"><Icon size={32} /></div>}
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 mb-6 max-w-md">{description}</p>
    {actionText && onAction && (
      <button 
        onClick={onAction}
        className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition"
      >
        {actionText}
      </button>
    )}
  </div>
);
