import { useEffect, useRef } from 'react';
import { useChart } from './ChartContainer';
import useMarketStore from '../../store/marketStore';
import useTradingStore from '../../store/tradingStore';

const MainChartSeries = ({ data = [], type = 'candlestick' }) => {
  const chart = useChart();
  const seriesRef = useRef(null);
  const priceLineRef = useRef(null);
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);

  const symbol = selectedStock?.symbol || 'AAPL';
  const livePriceData = prices[symbol];
  const currentPrice = livePriceData?.price ?? null;

  // --- Series lifecycle: create / destroy when chart instance or type changes ---
  useEffect(() => {
    if (!chart) return;

    try {
      if (type === 'candlestick') {
        seriesRef.current = chart.addCandlestickSeries({
          upColor: '#10b981',
          downColor: '#ef4444',
          borderUpColor: '#10b981',
          borderDownColor: '#ef4444',
          wickUpColor: '#10b981',
          wickDownColor: '#ef4444',
        });
      } else if (type === 'line') {
        seriesRef.current = chart.addLineSeries({
          color: '#2962FF',
          lineWidth: 2,
        });
      } else if (type === 'area') {
        seriesRef.current = chart.addAreaSeries({
          lineColor: '#2962FF',
          topColor: 'rgba(41, 98, 255, 0.28)',
          bottomColor: 'rgba(41, 98, 255, 0.05)',
          lineWidth: 2,
        });
      }
    } catch (err) {
      console.warn('[MainChartSeries] addSeries failed:', err.message);
      return;
    }

    return () => {
      priceLineRef.current = null;
      if (seriesRef.current) {
        try { chart.removeSeries(seriesRef.current); } catch (_) {}
        seriesRef.current = null;
      }
    };
  }, [chart, type]);

  // --- Data sync ---
  useEffect(() => {
    if (!seriesRef.current) return;

    if (!data || !data.length) {
      try { seriesRef.current.setData([]); } catch (_) {}
      return;
    }

    // Filter out any bars missing required OHLC fields
    const cleaned = data.filter(
      d => d != null && d.time != null &&
        typeof d.open === 'number' && isFinite(d.open) &&
        typeof d.high === 'number' && isFinite(d.high) &&
        typeof d.low  === 'number' && isFinite(d.low)  &&
        typeof d.close === 'number' && isFinite(d.close)
    );

    const sortedData = [...cleaned].sort((a, b) => {
      const tA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
      const tB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
      return tA - tB;
    });

    // Map data for line/area charts which only take `value` (usually close price)
    const formattedData = type === 'candlestick' ? sortedData : sortedData.map(d => ({
      time: d.time,
      value: d.close
    }));

    try {
      seriesRef.current.setData(formattedData);
      chart?.timeScale().fitContent();
    } catch (err) {
      console.warn('[MainChartSeries] setData failed:', err.message);
    }
  }, [data, chart, type]);

  // --- Live price line ---
  useEffect(() => {
    if (!seriesRef.current || !currentPrice || !isFinite(currentPrice)) return;

    try {
      if (!priceLineRef.current) {
        priceLineRef.current = seriesRef.current.createPriceLine({
          price: currentPrice,
          color: '#4CAF50',
          lineWidth: 2,
          axisLabelVisible: true,
          title: 'LIVE',
        });
      } else {
        priceLineRef.current.applyOptions({ price: currentPrice });
      }
    } catch (err) {
      console.warn('[MainChartSeries] price line error:', err.message);
    }
  }, [currentPrice, type]);

  return null;
};

export default MainChartSeries;
