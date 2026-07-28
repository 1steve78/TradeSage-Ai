import { useEffect, useState } from "react";
import { getStockHistory } from "../services/marketApi";
import usePortfolioStore from "../store/portfolioStore";
import useTradingStore from "../store/tradingStore";
import useMarketStore from "../store/marketStore";
import StockInfoPanel from "../components/Stock/StockInfoPanel";
import PortfolioSummary from "../components/Portfolio/PortfolioSummary";
import HoldingCard from "../components/Portfolio/HoldingCard";

import { useHistoricalData } from "../hooks/useHistoricalData";

import ChartContainer from "../components/Chart/ChartContainer";
import CandlestickChartSeries from "../components/Chart/CandlestickChart";
import VolumeChartSeries from "../components/Chart/VolumeChart";
import TimeframeSelector from "../components/Chart/TimeframeSelector";
import IndicatorSelector, { AVAILABLE_INDICATORS } from "../components/Chart/IndicatorSelector";
import IndicatorSeries from "../components/Chart/IndicatorSeries";

const MainChart = () => {
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);
  const [timeframe, setTimeframe] = useState("1M");
  const [selectedIndicators, setSelectedIndicators] = useState(["sma20"]);

  const toggleIndicator = (id) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const symbol = selectedStock?.symbol || "AAPL";
  const cleanSymbol = symbol.replace(/-EQ$/i, "").toUpperCase();
  const name = selectedStock?.companyName || "Apple Inc";

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

  const stockParam = {
    symbol,
    exchange: selectedStock?.exchange || (cleanSymbol === "SBIN" ? "NSE" : cleanSymbol === "TCS" ? "NSE" : cleanSymbol === "RELIANCE" ? "NSE" : null),
    token: selectedStock?.token || (cleanSymbol === "SBIN" ? "3045" : cleanSymbol === "TCS" ? "11536" : cleanSymbol === "RELIANCE" ? "2885" : null)
  };

  const { data: responseData, isLoading: loading, error: queryError } = useHistoricalData(stockParam, timeframe, selectedIndicators);
  const rawData = responseData?.data || [];
  const indicatorData = responseData?.indicators || {};
  
  const lastCandle = rawData.length > 0 ? rawData[rawData.length - 1] : null;
  const livePrice = prices[symbol]?.price ?? prices[cleanSymbol]?.price ?? lastCandle?.close ?? selectedStock?.price ?? (cleanSymbol === "SBIN" ? 842.60 : cleanSymbol === "TCS" ? 3856.00 : cleanSymbol === "RELIANCE" ? 1297.80 : 212.5);
  const error = queryError ? "Historical data unavailable" : null;

  const headerLeft = (
    <>
      <span className="font-headline-md font-bold text-sm text-[#0f172a]">{name} ({symbol})</span>
      <div className="flex items-center gap-xs px-2 py-0.5 bg-surface-container rounded border border-outline-variant text-[10px] font-bold text-slate-500 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"></span> 
        {symbol === "BTC" ? "Crypto" : symbol === "SBIN" || symbol === "SBIN-EQ" ? "NSE" : "NASDAQ"}
      </div>
    </>
  );

  const headerRight = (
    <>
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} timeframes={timeframes} />
    </>
  );

  return (
    <div>
      <IndicatorSelector selectedIndicators={selectedIndicators} onToggle={toggleIndicator} />
      <ChartContainer headerLeft={headerLeft} headerRight={headerRight} loading={loading} error={error}>
        <CandlestickChartSeries data={rawData} />
        {selectedIndicators.map(indId => {
          const config = AVAILABLE_INDICATORS.find(i => i.id === indId);
          return config ? (
            <IndicatorSeries 
              key={indId} 
              data={indicatorData[indId] || []} 
              color={config.color} 
            />
          ) : null;
        })}
        <VolumeChartSeries data={rawData} />
      </ChartContainer>
    </div>
  );
};

const HoldingsTable = () => {
  const { portfolio } = usePortfolioStore();
  const holdings = portfolio?.holdings ?? [];

  return (
    <div className="glass-card rounded overflow-hidden bg-white border border-[#e2e8f0]">
      <div className="p-md border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
        <span className="font-title-sm text-sm text-[#0f172a] font-bold">Your Holdings</span>
        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
          {holdings.length} Positions
        </span>
      </div>

      <div className="overflow-x-auto font-sans">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-bright border-b border-outline-variant">
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Quantity</th>
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Avg Price</th>
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Last Price</th>
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Market Value</th>
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Gain/Loss</th>
              <th className="px-md py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6]">
            {holdings.length > 0 ? (
              holdings.map((holding) => (
                <HoldingCard key={holding.symbol} holding={holding} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-xs text-slate-400 font-medium">
                  You do not own any assets yet. Select a stock on the left or search above to trade!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TransactionHistoryTable = () => {
  const { transactions } = usePortfolioStore();

  return (
    <div className="glass-card rounded overflow-hidden bg-white border border-[#e2e8f0]">
      <div className="p-md border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
        <span className="font-title-sm text-sm text-[#0f172a] font-bold">Transaction History</span>
        <button className="text-[10px] font-bold text-slate-500 hover:text-black transition cursor-pointer">
          Export History
        </button>
      </div>

      <div className="overflow-x-auto font-sans">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-bright border-b border-outline-variant">
            <tr>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Quantity</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Amount</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6] text-xs font-medium text-slate-700">
            {transactions.length > 0 ? (
              transactions.slice(0, 10).map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-400 font-normal">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-[#0f172a]">{tx.symbol}</td>
                  <td className="p-4">
                    <span className={`font-bold ${tx.type === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-right">₹{tx.price.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right text-slate-500">{tx.quantity}</td>
                  <td className="p-4 font-mono text-right font-bold">₹{tx.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      tx.status === "SUCCESS"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-xs text-slate-400 font-medium">
                  No transaction records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderBookWidget = () => {
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);

  const symbol = selectedStock?.symbol || "AAPL";
  const cleanSymbol = symbol.replace(/-EQ$/i, "").toUpperCase();
  const livePriceData = prices[symbol] || prices[cleanSymbol];
  const livePrice = livePriceData?.price ?? selectedStock?.price ?? (cleanSymbol === "SBIN" ? 842.60 : cleanSymbol === "TCS" ? 3856.00 : cleanSymbol === "RELIANCE" ? 1297.80 : 212.5);

  const asks = [
    { price: livePrice + 0.03, qty: 1250 },
    { price: livePrice + 0.02, qty: 840 },
    { price: livePrice + 0.01, qty: 2100 },
  ];

  const bids = [
    { price: livePrice - 0.01, qty: 950 },
    { price: livePrice - 0.02, qty: 1420 },
    { price: livePrice - 0.03, qty: 770 },
  ];

  return (
    <div className="glass-card rounded overflow-hidden bg-white border border-[#e2e8f0] font-sans">
      <div className="p-sm bg-surface-container-low border-b border-outline-variant/30 font-label-caps text-[9px] uppercase text-secondary tracking-widest flex justify-between font-bold">
        <span>Order Book</span>
        <span className="text-[#0f172a]">Spread: 0.02</span>
      </div>
      <div className="grid grid-cols-2 text-[10px] font-data-mono font-medium">
        <div className="p-sm space-y-1 bg-red-50/20 border-r border-[#f2f4f6]">
          {asks.map((ask, idx) => (
            <div key={idx} className="flex justify-between text-red-700">
              <span>₹{ask.price.toFixed(2)}</span>
              <span>{ask.qty}</span>
            </div>
          ))}
        </div>
        <div className="p-sm space-y-1 bg-green-50/20">
          {bids.map((bid, idx) => (
            <div key={idx} className="flex justify-between text-green-700">
              <span>₹{bid.price.toFixed(2)}</span>
              <span>{bid.qty}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-2 border-t border-outline-variant/30 text-center bg-surface-bright font-bold text-xs text-[#0f172a] font-data-mono">
        LTP: ₹{livePrice.toFixed(2)}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { fetchPortfolio, fetchTransactions } = usePortfolioStore();

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, [fetchPortfolio, fetchTransactions]);

  return (
    <div className="space-y-6">
      {/* Portfolio Stats Cards */}
      <PortfolioSummary />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Left Workspace: Chart + Holdings + History (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <MainChart />
          <HoldingsTable />
          <TransactionHistoryTable />
        </div>

        {/* Right Sidebar Widgets: Stock Details + Order Book (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <StockInfoPanel />
          <OrderBookWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;