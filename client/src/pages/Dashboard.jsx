import { useEffect, useState, useRef } from "react";
import { createChart } from "lightweight-charts";
import usePortfolioStore from "../store/portfolioStore";
import useTradingStore from "../store/tradingStore";
import useMarketStore from "../store/marketStore";
import { useSocket } from "../context/SocketContext";
import { useHistoricalData } from "../hooks/useHistoricalData";
import { Link } from "react-router-dom";
import MarketWidget from "../components/Dashboard/MarketWidget";
import useDashboardStore from "../store/dashboardStore";
import ErrorBoundary from "../components/common/ErrorBoundary";

// --- Components adapted to the Professional Ledger Theme ---

const PortfolioChart = () => {
  const { portfolio } = usePortfolioStore();
  const [timeframe, setTimeframe] = useState("1M");
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const lineSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height: 256,
      layout: {
        background: { color: "transparent" },
        textColor: "#9ca3af",
        fontFamily: "Hanken Grotesk, sans-serif",
      },
      grid: {
        vertLines: { color: "transparent" },
        horzLines: { color: "#f1f5f9" },
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
      },
      handleScroll: false,
      handleScale: false,
      crosshair: {
        horzLine: { visible: false },
        vertLine: { visible: false },
      },
      localization: {
        priceFormatter: p => '₹' + p.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      }
    });

    const lineSeries = chart.addLineSeries({
      color: "#10b981",
      lineWidth: 2.5,
      crosshairMarkerVisible: true,
      lastValueVisible: true,
      priceLineVisible: false,
    });

    chartRef.current = chart;
    lineSeriesRef.current = lineSeries;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!portfolio || !lineSeriesRef.current) return;

    const totalValue = portfolio.totalValue || (portfolio.cash + (portfolio.totalInvested || 0) + (portfolio.totalPnL || 0)) || 1000000;
    const totalPnL = portfolio.totalPnL || 0;
    const startValue = totalValue - totalPnL;
    
    // Generate mock historical curve leading to the current portfolio value
    const points = timeframe === '1Y' ? 120 : timeframe === '1M' ? 30 : timeframe === '1W' ? 7 : timeframe === '12H' ? 12 : timeframe === '3H' ? 12 : 24;
    const history = [];
    const now = new Date();

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime());
      
      if (timeframe === '1Y') time.setDate(time.getDate() - (i * 3));
      else if (timeframe === '1M') time.setDate(time.getDate() - i);
      else if (timeframe === '1W') time.setDate(time.getDate() - i);
      else if (timeframe === '12H') time.setHours(time.getHours() - i);
      else if (timeframe === '3H') time.setMinutes(time.getMinutes() - (i * 15));
      else time.setHours(time.getHours() - i); // 1H
      
      let val;
      if (i === 0) val = totalValue;
      else if (i === points) val = startValue;
      else {
        const progress = 1 - (i / points);
        const expectedValue = startValue + (totalPnL * progress);
        const volatility = totalValue * 0.002; // 0.2% random noise
        val = expectedValue + (Math.random() - 0.5) * volatility;
      }
      history.push({ time: Math.floor(time.getTime() / 1000), value: val });
    }

    lineSeriesRef.current.setData(history);
    chartRef.current.timeScale().fitContent();

  }, [portfolio, timeframe]);

  const timeframes = ["1H", "3H", "12H", "1W", "1M", "1Y"];

  return (
    <section className="bg-white rounded-custom p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-brand">Portfolio Performance</h2>
        <a className="text-sm font-semibold text-blue-600 hover:underline" href="#">Improve your portfolio</a>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex bg-surface-low rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeframe === tf
                  ? "font-bold bg-white text-brand shadow-sm"
                  : "text-gray-500 hover:bg-white/50"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <button className="p-2 bg-surface-low rounded-lg text-gray-400 hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      <div className="relative h-64 w-full">
        <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
      </div>
    </section>
  );
};

const AIInsightsTable = () => {
  return (
    <section className="bg-surface-lowest rounded-custom p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand">AI Insights</h2>
        <a className="text-sm font-semibold text-blue-600 hover:underline" href="#">View all insights</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="pb-4 font-medium">Stock</th>
              <th className="pb-4 font-medium">Price</th>
              <th className="pb-4 font-medium">Timeframe</th>
              <th className="pb-4 font-medium">Position</th>
              <th className="pb-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm border-t border-gray-50 divide-y divide-gray-50">
            {/* TSLA Row */}
            <tr className="hover:bg-gray-50 transition-colors group cursor-pointer">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-[10px]">TSLA</div>
                  <div>
                    <div className="font-bold text-brand">TSLA</div>
                    <div className="text-[10px] text-gray-400">Tesla Inc</div>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <div className="font-bold text-brand">$260.54</div>
                <div className="text-[10px] text-danger">-0.59%</div>
              </td>
              <td className="py-4 text-gray-400 font-medium text-xs">1M</td>
              <td className="py-4">
                <span className="px-3 py-1 bg-success-light text-success text-[10px] font-bold rounded-md uppercase tracking-wide">Buy</span>
              </td>
              <td className="py-4 text-right">
                <Link to="/stock/TSLA" className="text-blue-600 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">Details</Link>
              </td>
            </tr>
            {/* AAPL Row */}
            <tr className="hover:bg-gray-50 transition-colors group cursor-pointer">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center font-bold text-[10px]">AAPL</div>
                  <div>
                    <div className="font-bold text-brand">AAPL</div>
                    <div className="text-[10px] text-gray-400">Apple Inc</div>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <div className="font-bold text-brand">$212.50</div>
                <div className="text-[10px] text-success">+1.25%</div>
              </td>
              <td className="py-4 text-gray-400 font-medium text-xs">1D</td>
              <td className="py-4">
                <span className="px-3 py-1 bg-success-light text-success text-[10px] font-bold rounded-md uppercase tracking-wide">Buy</span>
              </td>
              <td className="py-4 text-right">
                <Link to="/stock/AAPL" className="text-blue-600 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">Details</Link>
              </td>
            </tr>
            {/* NVDA Row */}
            <tr className="hover:bg-gray-50 transition-colors group cursor-pointer">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-[10px]">NVDA</div>
                  <div>
                    <div className="font-bold text-brand">NVDA</div>
                    <div className="text-[10px] text-gray-400">NVIDIA Corp</div>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <div className="font-bold text-brand">$182.60</div>
                <div className="text-[10px] text-danger">-2.10%</div>
              </td>
              <td className="py-4 text-gray-400 font-medium text-xs">1W</td>
              <td className="py-4">
                <span className="px-3 py-1 bg-danger-light text-danger text-[10px] font-bold rounded-md uppercase tracking-wide">Sell</span>
              </td>
              <td className="py-4 text-right">
                <Link to="/stock/NVDA" className="text-blue-600 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">Details</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};



const CalendarWidget = () => {
  return (
    <section className="bg-white rounded-custom p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand">Calendar</h2>
        <a className="text-sm font-semibold text-blue-600 hover:underline" href="#">View calendar</a>
      </div>
      <div className="flex bg-surface-low rounded-lg p-1 mb-6">
        <button className="flex-1 py-1.5 text-xs font-bold bg-white text-brand rounded-md shadow-sm">All</button>
        <button className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:bg-white/50 rounded-md">Meetings</button>
        <button className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:bg-white/50 rounded-md">Calls</button>
      </div>
      <div className="space-y-6">
        {/* Calendar Event 1 */}
        <div className="flex gap-4 group cursor-pointer">
          <div className="text-center w-10">
            <div className="text-lg font-bold text-brand group-hover:text-blue-600 transition-colors">21</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jul</div>
          </div>
          <div>
            <div className="text-sm font-bold text-brand">FOMC Meeting Minutes</div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Macro Event • 21 Jul 2026 • 20:00
            </div>
          </div>
        </div>
        {/* Calendar Event 2 */}
        <div className="flex gap-4 group cursor-pointer">
          <div className="text-center w-10">
            <div className="text-lg font-bold text-brand group-hover:text-blue-600 transition-colors">29</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jul</div>
          </div>
          <div>
            <div className="text-sm font-bold text-brand">AAPL Earnings Call</div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              Corporate • 29 Jul 2026 • 16:30
            </div>
          </div>
        </div>
        {/* Calendar Event 3 */}
        <div className="flex gap-4 group cursor-pointer">
          <div className="text-center w-10">
            <div className="text-lg font-bold text-brand group-hover:text-blue-600 transition-colors">08</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aug</div>
          </div>
          <div>
            <div className="text-sm font-bold text-brand">CPI Data Release</div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Macro Event • 08 Aug 2026 • 08:30
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Dashboard = () => {
  const { fetchDashboard, dashboardData, isLoading } = useDashboardStore();
  const { joinStockRoom } = useSocket();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const holdings = dashboardData?.portfolio?.holdings;
    if (!holdings?.length) return;
    
    holdings.forEach((holding) => {
      if (holding.token) {
        joinStockRoom(holding.symbol, holding.token, holding.exchange || "NSE");
      }
    });
  }, [dashboardData, joinStockRoom]);

  return (
    <div className="space-y-6 pt-4 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-brand mb-6 px-1">Dashboard</h1>
      
      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ErrorBoundary>
            <AIInsightsTable />
          </ErrorBoundary>
          <ErrorBoundary>
            <PortfolioChart />
          </ErrorBoundary>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <ErrorBoundary>
            <MarketWidget />
          </ErrorBoundary>
          <ErrorBoundary>
            <CalendarWidget />
          </ErrorBoundary>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;