import React from "react";

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "market", label: "Market" },
  { id: "technology", label: "Technology" },
  { id: "banking", label: "Banking" },
  { id: "energy", label: "Energy" },
];

/**
 * NewsCategoryTabs Component
 *
 * Frontend category filter tabs for instant responsive filtering.
 */
export const NewsCategoryTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-sm overflow-x-auto pb-1 no-scrollbar border-b border-outline-variant/60">
      {CATEGORIES.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-t transition cursor-pointer whitespace-nowrap border-b-2 ${
              isActive
                ? "border-primary text-primary bg-surface-container-low font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default NewsCategoryTabs;
