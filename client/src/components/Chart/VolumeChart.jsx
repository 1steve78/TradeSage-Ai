import { useEffect, useRef } from 'react';
import { useChart } from './ChartContainer';

const VolumeChart = ({ data = [] }) => {
  const chart = useChart();
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chart) return;

    seriesRef.current = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // set as an overlay by setting a blank priceScaleId
      priceScale: {
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      },
    });

    return () => {
      if (seriesRef.current) {
        chart.removeSeries(seriesRef.current);
        seriesRef.current = null;
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
    
    const volumeData = sortedData.map(d => ({
      time: d.time,
      value: d.volume || 0,
      color: d.close >= d.open ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"
    }));
    
    seriesRef.current.setData(volumeData);
  }, [data]);

  return null;
};

export default VolumeChart;
