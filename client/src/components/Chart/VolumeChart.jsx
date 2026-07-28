import { useEffect, useRef } from 'react';
import { useChart } from './ChartContainer';

const VolumeChart = ({ data = [] }) => {
  const chart = useChart();
  const seriesRef = useRef(null);

  // --- Series lifecycle: create / destroy when chart instance changes ---
  useEffect(() => {
    if (!chart) return;

    if (typeof chart.addHistogramSeries !== 'function') {
      console.warn('[VolumeChart] addHistogramSeries not available on this chart instance.');
      return;
    }

    try {
      // In lightweight-charts v4, do NOT pass `priceScale` inside series options —
      // it triggers an internal `ensureDefined` assertion and throws "Value is undefined".
      // Set scale margins separately on the price scale AFTER creation.
      seriesRef.current = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume-overlay',
      });

      // Correctly set scale margins via the price scale API (v4)
      seriesRef.current.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
    } catch (err) {
      console.warn('[VolumeChart] addHistogramSeries failed:', err.message);
      seriesRef.current = null;
      return;
    }

    return () => {
      if (seriesRef.current) {
        try { chart.removeSeries(seriesRef.current); } catch (_) {}
        seriesRef.current = null;
      }
    };
  }, [chart]);

  // --- Data sync ---
  useEffect(() => {
    if (!seriesRef.current || !chart) return;

    if (!data || !data.length) {
      try { seriesRef.current.setData([]); } catch (_) {}
      return;
    }

    const cleaned = data.filter(d => d != null && d.time != null);
    const sortedData = [...cleaned].sort((a, b) => {
      const tA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
      const tB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
      return tA - tB;
    });

    const volumeData = sortedData.map(d => ({
      time: d.time,
      value: typeof d.volume === 'number' && isFinite(d.volume) ? d.volume : 0,
      color: (d.close ?? 0) >= (d.open ?? 0)
        ? 'rgba(16, 185, 129, 0.4)'
        : 'rgba(239, 68, 68, 0.4)',
    }));

    try {
      seriesRef.current.setData(volumeData);
    } catch (err) {
      console.warn('[VolumeChart] setData failed:', err.message);
    }
  }, [data, chart]);

  return null;
};

export default VolumeChart;
