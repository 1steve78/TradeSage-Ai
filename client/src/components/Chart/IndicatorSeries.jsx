import { useEffect, useRef } from 'react';
import { useChart } from './ChartContainer';

const IndicatorSeries = ({ data = [], color, lineWidth = 2 }) => {
  const chart = useChart();
  const seriesRef = useRef(null);

  useEffect(() => {
    // Guard: chart is null until ChartContainer's useEffect fires and calls setChart
    if (!chart) return;

    // Guard: sanity-check the API method exists (v3 vs v4 lightweight-charts compat)
    if (typeof chart.addLineSeries !== 'function') {
      console.warn('IndicatorSeries: addLineSeries is not available on this chart instance.');
      return;
    }

    try {
      seriesRef.current = chart.addLineSeries({
        color: color,
        lineWidth: lineWidth,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: false,
      });
    } catch (err) {
      console.warn('IndicatorSeries: could not add line series —', err.message);
      return;
    }

    return () => {
      if (seriesRef.current) {
        try { chart.removeSeries(seriesRef.current); } catch (_) {}
        seriesRef.current = null;
      }
    };
  }, [chart, color, lineWidth]);

  useEffect(() => {
    if (!seriesRef.current) return;

    const safeData = Array.isArray(data) ? data : [];
    if (!safeData.length) {
      try { seriesRef.current.setData([]); } catch (_) {}
      return;
    }

    // Filter out malformed entries — this is what triggered "Value is undefined"
    // when lightweight-charts' internal ensureDefined received null/undefined value
    const cleaned = safeData.filter(
      d => d != null && d.time != null && typeof d.value === 'number' && isFinite(d.value)
    );

    const sortedData = [...cleaned].sort((a, b) => {
      const tA = typeof a.time === 'string' ? new Date(a.time).getTime() : a.time;
      const tB = typeof b.time === 'string' ? new Date(b.time).getTime() : b.time;
      return tA - tB;
    });

    try {
      seriesRef.current.setData(sortedData);
    } catch (err) {
      console.warn('IndicatorSeries: setData error —', err.message);
    }
  }, [data, chart]);

  return null;
};

export default IndicatorSeries;
