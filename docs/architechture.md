               Market API
                    |
                    v
            Socket Server
                    |
                    v
React <--------> Express
                    |
                    |
             AI Service
                    |
                    v
              Gemini/OpenAI

                    |
                    v
               MongoDB

---

# Real-time Price Update Flow

```text
Market API

↓

Market Service

↓

Socket Server

↓

Rooms

↓

React Socket Context

↓

Market Store

↓

UI
```

# Chart Component Flow (Day 5)

```text
React Query (useHistoricalData)
       ↓
Dashboard (MainChart)
       ↓
ChartContainer (ResizeObserver & Error Boundary)
       ├── CandlestickChart (Main Series & Live Price Line)
       ├── VolumeChart (Histogram Series)
       └── IndicatorSeries (Multiple Dynamic Overlays)
```

**Indicator Calculation (Backend)**
`indicatorService.js` calculates SMA/EMA and normalizes the output shapes before sending to frontend, preventing Heavy calculation freezes in React.