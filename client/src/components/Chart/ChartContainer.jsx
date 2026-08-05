import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

// Use null (not undefined) so the ?? guard in useChart works correctly.
// If context were undefined, consumers would receive undefined on first render
// before setChart fires, bypassing the null guard and reaching library internals
// that throw "Value is undefined" via ensureDefined().
const ChartContext = createContext(null);

export const useChart = () => {
  return useContext(ChartContext); // already null on first render — safe
};

const ChartContainer = ({ children, loading, error }) => {
  const chartContainerRef = useRef(null);
  // useState so React re-renders children when the real chart instance arrives.
  // Starts as null so all child series components receive null and bail early.
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let newChart;
    try {
      newChart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth || 600,
        height: chartContainerRef.current.clientHeight || 320,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#0f172a',
          fontFamily: 'Hanken Grotesk, sans-serif',
        },
        grid: {
          vertLines: { color: '#f2f4f6' },
          horzLines: { color: '#f2f4f6' },
        },
        rightPriceScale: {
          borderColor: '#e2e8f0',
        },
        timeScale: {
          borderColor: '#e2e8f0',
          timeVisible: true,
          // Lock the time axis — no panning past the data boundaries
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: false,
          fixLeftEdge: true,
          fixRightEdge: true,
        },
        crosshair: {
          mode: 1, // CrosshairMode.Normal
        },
        // Disable all mouse/touch scrolling and scaling
        handleScroll: false,
        handleScale: false,
      });
    } catch (err) {
      console.error('[ChartContainer] createChart failed:', err.message);
      return;
    }

    setChart(newChart);

    const handleResize = () => {
      if (chartContainerRef.current) {
        try {
          newChart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        } catch (_) {}
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Null the state BEFORE removing so in-flight children don't call into
      // a destroyed chart instance during their own cleanup effects
      setChart(null);
      try { newChart.remove(); } catch (_) {}
    };
  }, []);

  return (
    <ChartContext.Provider value={chart}>
      <div className="glass-card rounded flex flex-col h-[400px] bg-white border border-[#e2e8f0]">
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
