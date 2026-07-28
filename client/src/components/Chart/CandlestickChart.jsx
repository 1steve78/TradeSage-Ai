import { useEffect, useRef } from 'react';
import { useChart } from './ChartContainer';
import useMarketStore from '../../store/marketStore';
import useTradingStore from '../../store/tradingStore';

const CandlestickChart = ({ data = [] }) => {
  const chart = useChart();
  const seriesRef = useRef(null);
  const priceLineRef = useRef(null);
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);

  const symbol = selectedStock?.symbol || 'AAPL';
  const livePriceData = prices[symbol];
  const currentPrice = livePriceData?.price ?? null;

  // --- Series lifecycle: create / destroy when chart instance changes ---
  useEffect(() => {
    if (!chart) return;

    if (typeof chart.addCandlestickSeries !== 'function') {
      console.warn('[CandlestickChart] addCandlestickSeries not available on this chart instance.');
      return;
    }

    try {
      seriesRef.current = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
    } catch (err) {
      console.warn('[CandlestickChart] addCandlestickSeries failed:', err.message);
      return;
    }

    return () => {
      priceLineRef.current = null;
      if (seriesRef.current) {
        try { chart.removeSeries(seriesRef.current); } catch (_) {}
        seriesRef.current = null;
      }
    };
  }, [chart]);

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

    try {
      seriesRef.current.setData(sortedData);
      chart?.timeScale().fitContent();
    } catch (err) {
      console.warn('[CandlestickChart] setData failed:', err.message);
    }
  }, [data, chart]);

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
      console.warn('[CandlestickChart] price line error:', err.message);
    }
  }, [currentPrice]);

  return null;
};

export default CandlestickChart;
