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
  
  const symbol = selectedStock?.symbol || "AAPL";
  const livePriceData = prices[symbol];
  const currentPrice = livePriceData?.price ?? null;

  useEffect(() => {
    if (!chart) return;
    
    seriesRef.current = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    return () => {
      if (seriesRef.current) {
        chart.removeSeries(seriesRef.current);
        seriesRef.current = null;
        priceLineRef.current = null;
      }
    };
  }, [chart]);

  useEffect(() => {
    if (!seriesRef.current) return;

    if (!data || !data.length) {
      seriesRef.current.setData([]);
      return;
    }

    const cleaned = data.filter(d => d && d.time != null);
    const sortedData = [...cleaned].sort((a, b) => {
      const tA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
      const tB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
      return tA - tB;
    });

    seriesRef.current.setData(sortedData);
    chart?.timeScale().fitContent();
  }, [data, chart]);

  useEffect(() => {
    if (seriesRef.current && currentPrice) {
      if (!priceLineRef.current) {
        priceLineRef.current = seriesRef.current.createPriceLine({
          price: currentPrice,
          color: "#4CAF50",
          lineWidth: 2,
          axisLabelVisible: true,
          title: "LIVE",
        });
      } else {
        priceLineRef.current.applyOptions({
          price: currentPrice
        });
      }
    }
  }, [currentPrice]);

  return null;
};

export default CandlestickChart;
