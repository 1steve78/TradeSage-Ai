import React, { useState } from "react";
import { Search, X } from "lucide-react";

/**
 * NewsSearch Component
 *
 * Search input for filtering headlines & company news.
 */
export const NewsSearch = ({ searchQuery, onSearchChange, placeholder = "Search news by keyword or symbol (e.g. TCS, earnings)..." }) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 rounded pl-9 pr-8 py-2 text-xs font-medium text-[#0f172a] outline-none shadow-xs placeholder:text-slate-400"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default NewsSearch;
