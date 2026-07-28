import React from "react";
import { Newspaper } from "lucide-react";

/**
 * SourceList Component
 *
 * Renders pill list of news sources (e.g. Reuters, Economic Times)
 * providing evidence for the AI price movement explanation.
 */
export const SourceList = ({ sources = [] }) => {
  if (!sources || sources.length === 0) {
    return (
      <div className="text-[11px] text-slate-400 font-medium italic">
        No cited news sources available.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <Newspaper className="w-3 h-3 text-slate-400" />
        Sources:
      </span>
      {sources.map((src, idx) => (
        <span
          key={idx}
          className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200"
        >
          • {src}
        </span>
      ))}
    </div>
  );
};

export default SourceList;
