import React from "react";

const PageSkeleton = () => {
  return (
    <div className="w-full h-full p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-64 bg-gray-100 rounded-custom"></div>
          <div className="h-48 bg-gray-100 rounded-custom"></div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-96 bg-gray-100 rounded-custom"></div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
