import { useEffect, useRef } from 'react';
import { LineSeries } from 'lightweight-charts';
import { useChart } from './ChartContainer';

const IndicatorSeries = ({ data, color, lineWidth = 2 }) => {
  const chart = useChart();
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chart) return;
    
    seriesRef.current = chart.addSeries(LineSeries, {
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
  }, [data, chart]);

  return null;
};

export default IndicatorSeries;
