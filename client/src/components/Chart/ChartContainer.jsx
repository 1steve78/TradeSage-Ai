import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const ChartContext = createContext(null);

export const useChart = () => useContext(ChartContext);

const ChartContainer = ({ children, headerLeft, headerRight, loading, error }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const newChart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height: chartContainerRef.current.clientHeight || 320,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#0f172a",
        fontFamily: "Hanken Grotesk, sans-serif",
      },
      grid: {
        vertLines: { color: "#f2f4f6" },
        horzLines: { color: "#f2f4f6" },
      },
      rightPriceScale: {
        borderColor: "#e2e8f0",
      },
      timeScale: {
        borderColor: "#e2e8f0",
        timeVisible: true,
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
      }
    });
    chartRef.current = newChart;
    forceRender(x => x + 1);

    const handleResize = () => {
      if (chartContainerRef.current) {
        newChart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      newChart.remove();
      chartRef.current = null;
    };
  }, []);

  return (
    <ChartContext.Provider value={chartRef.current}>
      <div className="glass-card rounded flex flex-col h-[400px] bg-white border border-[#e2e8f0]">
        <div className="p-md border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-md">
            {headerLeft}
          </div>
          <div className="flex gap-1 items-center">
            {headerRight}
          </div>
        </div>
        
        <div className="flex-1 p-md relative overflow-hidden bg-white">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-xs font-bold text-[#0f172a] font-sans">
              Loading chart data...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 text-xs font-bold text-red-500 font-sans">
              {error}
            </div>
          )}
          <div ref={chartContainerRef} className="w-full h-full" />
          {children}
        </div>
      </div>
    </ChartContext.Provider>
  );
};

export default ChartContainer;
