import { useEffect, useState, useRef } from "react";
import { createChart, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { getStockHistory } from "../../services/marketApi";
import useMarketStore from "../../store/marketStore";

import { useHistoricalData } from "../../hooks/useHistoricalData";

const MarketChart = () => {
  const pricesMap = useMarketStore((state) => state.prices);
  const [timeframe, setTimeframe] = useState("1M");

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const btcPrice = pricesMap["BTC"]?.price ?? 67284.10;
  const btcPrev = pricesMap["BTC"]?.previousPrice ?? 67500.00;
  const btcChange = btcPrice - btcPrev;
  const btcPct = (btcChange / btcPrev) * 100;

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

  const stockParam = {
    symbol: "BTC",
    exchange: null,
    token: null
  };

  const { data: rawData, isLoading: loading, error: queryError } = useHistoricalData(stockParam, timeframe);
  const error = queryError ? "Historical data unavailable" : null;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
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
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // set as an overlay
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Fetch BTC data
  useEffect(() => {
    if (rawData && candleSeriesRef.current && volumeSeriesRef.current && chartRef.current) {
      const sortedData = [...rawData].sort((a, b) => a.time - b.time);
      
      candleSeriesRef.current.setData(sortedData);
      
      const volumeData = sortedData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"
      }));
      
      volumeSeriesRef.current.setData(volumeData);
      chartRef.current.timeScale().fitContent();
    } else if (!rawData && !loading && candleSeriesRef.current && volumeSeriesRef.current) {
      candleSeriesRef.current.setData([]);
      volumeSeriesRef.current.setData([]);
    }
  }, [rawData, loading]);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-4">
      {/* Chart Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#f2f4f6]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              ₿
            </span>
            <h3 className="text-sm font-bold text-[#0f172a]">
              BTC/USDT
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-[#0f172a]">
              ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`font-mono text-xs font-bold ${btcChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {btcChange >= 0 ? "+" : ""}{btcPct.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timeframes */}
          <div className="flex bg-[#f2f4f6] p-0.5 rounded-[2px] text-[10px] font-bold text-slate-500">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  timeframe === tf
                    ? "bg-white text-[#0f172a] shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real Candlestick Chart */}
      <div className="h-80 w-full relative bg-white rounded-[2px] overflow-hidden border border-[#f2f4f6] p-4">
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
      </div>
    </div>
  );
};

export default MarketChart;
