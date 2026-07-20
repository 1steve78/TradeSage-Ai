import React from 'react';

const TimeframeSelector = ({ timeframe, setTimeframe, timeframes }) => {
  return (
    <>
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf)}
          className={`px-2.5 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
            timeframe === tf
              ? "bg-primary text-white"
              : "text-slate-500 hover:bg-surface-container"
          }`}
        >
          {tf}
        </button>
      ))}
    </>
  );
};

export default TimeframeSelector;
