import { useEffect, useRef } from 'react';
import { useChart } from './ChartContainer';

const IndicatorSeries = ({ data = [], color, lineWidth = 2 }) => {
  const chart = useChart();
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chart) return;
    
    seriesRef.current = chart.addLineSeries({
      color: color,
      lineWidth: lineWidth,
      crosshairMarkerVisible: true,
      lastValueVisible: true,
      priceLineVisible: false,
    });

    return () => {
      if (seriesRef.current) {
        chart.removeSeries(seriesRef.current);
        seriesRef.current = null;
      }
    };
  }, [chart, color, lineWidth]);

  useEffect(() => {
    if (!seriesRef.current) return;

    const safeData = Array.isArray(data) ? data : [];
    if (!safeData.length) {
      seriesRef.current.setData([]);
      return;
    }

    const cleaned = safeData.filter(d => d && d.time != null && d.value != null);
    const sortedData = [...cleaned].sort((a, b) => {
      const tA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
      const tB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
      return tA - tB;
    });
    
    seriesRef.current.setData(sortedData);
  }, [data, chart]);

  return null;
};

export default IndicatorSeries;
