# Chart Architecture

## Components

- **ChartContainer**: The wrapper component managing dimensions, ResizeObserver, error boundaries, and loading states.
- **CandlestickChart**: Handles rendering the main OHLC candlestick series using `lightweight-charts`.
- **VolumeChart**: Uses `HistogramSeries` to render green/red volume bars under the price data.
- **IndicatorSeries**: Uses `LineSeries` to plot dynamic technical indicators like SMA and EMA over the main chart.
- **TimeframeSelector**: Dispatches changes to the parent which triggers new `useHistoricalData` queries.
- **IndicatorSelector**: Provides toggles for indicators (SMA20, SMA50, EMA9, etc.).

## Data Flow
1. User selects a timeframe or an indicator in the UI.
2. `useHistoricalData` react-query hook runs, querying the `/api/stocks/:symbol/history` backend.
3. Data is returned in `{ data, indicators }` format.
4. `Dashboard` (MainChart) passes the raw data to `CandlestickChart` and `VolumeChart`, and passes the mapped indicator arrays to dynamically mapped `IndicatorSeries`.
5. Charts use a defensive `.filter` and `.sort` to ensure malformed backend data cannot crash the `lightweight-charts` rendering pipeline.
