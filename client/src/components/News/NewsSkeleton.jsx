import React from "react";

export const NewsSkeleton = () => {
  return (
    <div className="space-y-lg animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant p-lg rounded h-48"></div>
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant p-lg rounded h-48"></div>
      </div>

      {/* Trending News Skeleton */}
      <div className="space-y-md">
        <div className="h-4 bg-slate-200 rounded w-36"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded p-md h-40 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </div>

      {/* News List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {[1, 2, 4, 5].map((i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded p-lg space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSkeleton;
