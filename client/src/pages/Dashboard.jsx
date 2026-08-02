import { useEffect, useState, useRef } from "react";
import { createChart } from "lightweight-charts";
import usePortfolioStore from "../store/portfolioStore";
import useTradingStore from "../store/tradingStore";
import useMarketStore from "../store/marketStore";
import { useSocket } from "../context/SocketContext";
import { useHistoricalData } from "../hooks/useHistoricalData";
import { Link } from "react-router-dom";

// --- Components adapted to the Professional Ledger Theme ---

const CandlestickChart = () => {
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);
  const [timeframe, setTimeframe] = useState("1M");

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const lineSeriesRef = useRef(null);

  const symbol = selectedStock?.symbol || "AAPL";
  const stockParam = {
    symbol,
    exchange: symbol === "SBIN" || symbol === "SBIN-EQ" ? "NSE" : null,
    token: symbol === "SBIN" || symbol === "SBIN-EQ" ? "3045" : null
  };

  const { data: responseData, isLoading: loading } = useHistoricalData(stockParam, timeframe);
  const rawData = Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height: 256, // matches h-64 in the design
      layout: {
        background: { color: "transparent" },
        textColor: "#9ca3af", // text-gray-400
        fontFamily: "Hanken Grotesk, sans-serif",
      },
      grid: {
        vertLines: { color: "transparent" },
        horzLines: { color: "#f1f5f9" },
      },
      rightPriceScale: {
        visible: false, // We're hiding the built-in scale to match the clean design
      },
      timeScale: {
        visible: false, // Hiding default time scale to match the clean design
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: false,
      handleScale: false,
      crosshair: {
        horzLine: { visible: false },
        vertLine: { visible: false },
      }
    });

    const lineSeries = chart.addLineSeries({
      color: "#10b981", // success color
      lineWidth: 2.5,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
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
    if (rawData && rawData.length > 0 && lineSeriesRef.current && chartRef.current) {
      const sortedData = [...rawData].sort((a, b) => a.time - b.time);
      const lineData = sortedData.map(d => ({
        time: d.time,
        value: d.close
      }));
      lineSeriesRef.current.setData(lineData);
      chartRef.current.timeScale().fitContent();
    } else if (!loading && lineSeriesRef.current) {
      lineSeriesRef.current.setData([]);
    }
  }, [rawData, loading]);

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

      {/* Main Line Chart */}
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 flex flex-col justify-between py-2 text-[10px] text-gray-300 pointer-events-none z-10">
          <span>$16,000</span>
          <span>$15,000</span>
          <span>$14,000</span>
          <span>$12,000</span>
        </div>
        <div className="h-full ml-12 border-l border-b border-gray-100 relative">
           <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
           {loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/50 text-xs font-bold text-gray-400 z-20">
               Loading...
             </div>
           )}
        </div>
        <div className="ml-12 flex justify-between pt-2 text-[10px] text-gray-400">
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
        </div>
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

const MarketWidget = () => {
  const prices = useMarketStore((state) => state.prices);
  
  const marketData = [
    { symbol: "SPOT", name: "Spotify Technology", price: 192.77, change: -0.18, colorClass: "bg-green-50 text-green-600" },
    { symbol: "PYPL", name: "PayPal Holdings", price: 66.43, change: 0.83, colorClass: "bg-blue-50 text-blue-600" },
    { symbol: "AMZN", name: "Amazon.com Inc", price: 125.49, change: -1.27, colorClass: "bg-gray-50 text-gray-500" }
  ];

  return (
    <section className="bg-white rounded-custom p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand">Market</h2>
        <a className="text-sm font-semibold text-blue-600 hover:underline" href="#">View market</a>
      </div>
      <div className="flex bg-surface-low rounded-lg p-1 mb-6">
        <button className="flex-1 py-1.5 text-xs font-bold bg-white text-brand rounded-md shadow-sm">Trending</button>
        <button className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:bg-white/50 rounded-md">Gainers</button>
        <button className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:bg-white/50 rounded-md">Losers</button>
      </div>
      <div className="space-y-4">
        {marketData.map((item, i) => {
          const livePrice = prices[item.symbol]?.price || item.price;
          return (
            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${item.colorClass}`}>
                  {item.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold text-brand group-hover:text-blue-600 transition-colors">{item.symbol}</div>
                  <div className="text-[10px] text-gray-400">{item.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-brand">${livePrice.toFixed(2)}</div>
                <div className={`text-[10px] font-bold ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </div>
              </div>
            </div>
          );
        })}
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
  const { fetchPortfolio, fetchTransactions, portfolio } = usePortfolioStore();
  const { joinStockRoom } = useSocket();

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, [fetchPortfolio, fetchTransactions]);

  useEffect(() => {
    if (!portfolio?.holdings?.length) return;
    portfolio.holdings.forEach((holding) => {
      if (holding.token) {
        joinStockRoom(holding.symbol, holding.token, holding.exchange || "NSE");
      }
    });
  }, [portfolio, joinStockRoom]);

  return (
    <div className="space-y-6 pt-4 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-brand mb-6 px-1">Dashboard</h1>
      
      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AIInsightsTable />
          <CandlestickChart />
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <MarketWidget />
          <CalendarWidget />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;