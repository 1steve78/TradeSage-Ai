import { useEffect, useState } from "react";
import usePortfolioStore from "../store/portfolioStore";
import useTradingStore from "../store/tradingStore";
import useMarketStore from "../store/marketStore";
import StockDetails from "../components/Stock/StockDetails";
import PortfolioSummary from "../components/Portfolio/PortfolioSummary";
import HoldingCard from "../components/Portfolio/HoldingCard";

const CandlestickChart = () => {
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);
  const [timeframe, setTimeframe] = useState("1D");

  const symbol = selectedStock?.symbol || "AAPL";
  const name = selectedStock?.companyName || "Apple Inc";
  const livePrice = prices[symbol]?.price ?? 212.5;

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

  return (
    <div className="glass-card rounded flex flex-col h-[400px] bg-white border border-[#e2e8f0]">
      <div className="p-md border-b border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-md">
          <span className="font-headline-md font-bold text-sm text-[#0f172a]">{name} ({symbol})</span>
          <div className="flex items-center gap-xs px-2 py-0.5 bg-surface-container rounded border border-outline-variant text-[10px] font-bold text-slate-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"></span> 
            {symbol === "BTC" ? "Crypto" : "NASDAQ"}
          </div>
        </div>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                timeframe === tf
                  ? "bg-primary text-white"
                  : "text-slate-500 hover:bg-surface-container"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {/* Candlestick grid container */}
      <div className="flex-1 p-md relative overflow-hidden bg-white">
        <div 
          className="absolute inset-0 opacity-40" 
          style={{ 
            backgroundImage: "linear-gradient(to bottom, #F2F4F6 1px, transparent 1px), linear-gradient(to right, #F2F4F6 1px, transparent 1px)", 
            backgroundSize: "40px 40px" 
          }}
        ></div>
        
        {/* Simulate charts wicks and body */}
        <div className="relative w-full h-full flex items-end gap-2 pb-6">
          <div className="flex-1 h-full flex flex-col justify-end gap-2 z-10">
            <div className="w-full flex items-end justify-between px-6 h-2/3">
              <div className="w-3 bg-red-400 h-24 relative rounded-[1px]">
                <div className="absolute w-[1.5px] h-32 bg-red-400 left-1/2 -translate-x-1/2 -top-4"></div>
              </div>
              <div className="w-3 bg-green-400 h-32 relative rounded-[1px]">
                <div className="absolute w-[1.5px] h-40 bg-green-400 left-1/2 -translate-x-1/2 -top-4"></div>
              </div>
              <div className="w-3 bg-green-400 h-40 relative rounded-[1px]">
                <div className="absolute w-[1.5px] h-48 bg-green-400 left-1/2 -translate-x-1/2 -top-4"></div>
              </div>
              <div className="w-3 bg-red-400 h-20 relative rounded-[1px]">
                <div className="absolute w-[1.5px] h-30 bg-red-400 left-1/2 -translate-x-1/2 -top-4"></div>
              </div>
              <div className="w-3 bg-green-400 h-44 relative rounded-[1px]">
                <div className="absolute w-[1.5px] h-52 bg-green-400 left-1/2 -translate-x-1/2 -top-4"></div>
              </div>
              <div className="w-3 bg-green-400 h-36 relative rounded-[1px]">
                <div className="absolute w-[1.5px] h-44 bg-green-400 left-1/2 -translate-x-1/2 -top-4"></div>
              </div>
            </div>
            {/* Volume Blocks */}
            <div className="w-full h-16 flex items-end gap-[4px] opacity-10 px-4">
              <div className="flex-1 bg-primary h-8 rounded-[1px]"></div>
              <div className="flex-1 bg-primary h-12 rounded-[1px]"></div>
              <div className="flex-1 bg-primary h-10 rounded-[1px]"></div>
              <div className="flex-1 bg-primary h-14 rounded-[1px]"></div>
              <div className="flex-1 bg-primary h-6 rounded-[1px]"></div>
              <div className="flex-1 bg-primary h-9 rounded-[1px]"></div>
            </div>
          </div>

          {/* Current Live Price tag indicator */}
          <div 
            className="absolute right-0 border border-[#cbd5e1] bg-slate-900 text-white font-data-mono text-[10px] px-2 py-0.5 rounded shadow z-20"
            style={{ bottom: `${(livePrice % 100) * 1.5}px` }}
          >
            LTP: ₹{livePrice.toFixed(2)}
          </div>
        </div>
      </div>
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

const AIRecommendationWidget = () => {
  const { selectedStock } = useTradingStore();
  
  const symbol = selectedStock?.symbol || "AAPL";
  const name = selectedStock?.companyName || "Apple Inc";

  const getRationale = (sym) => {
    if (sym === "AAPL") {
      return [
        "Strong quarterly earnings with 15% YoY growth in services sector.",
        "Positive RSI momentum and breakout from 50-day EMA support levels.",
        "Major support level identified at ₹210 with high liquid absorption."
      ];
    }
    if (sym === "TSLA") {
      return [
        "Elevated risk due to inventory build-up and compressed profit margins.",
        "Bearish MACD crossover on daily chart, indicating down momentum.",
        "Key support lies at ₹172. Recommend wait-and-watch stance."
      ];
    }
    return [
      "Moderate relative strength index (RSI) indicating stable consolidation.",
      "Steady accumulation by institutional funds over the last 30 days.",
      "Clear channel pattern resistance at 1.05x of current market value."
    ];
  };

  const getRiskScore = (sym) => {
    if (sym === "AAPL") return 78;
    if (sym === "TSLA") return 42;
    if (sym === "NVDA") return 88;
    return 65;
  };

  const getRating = (score) => {
    if (score >= 75) return "BUY";
    if (score <= 45) return "SELL";
    return "HOLD";
  };

  const score = getRiskScore(symbol);
  const rating = getRating(score);

  return (
    <div className="bg-[#131b2e] p-md rounded text-white relative overflow-hidden font-sans border border-black shadow">
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#dae2fd]">auto_awesome</span>
          <span className="font-label-caps text-[10px] tracking-[0.2em] text-[#bec6e0] uppercase font-bold">
            TradeSage AI Analysis
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[#bec6e0] mb-1 font-semibold">Risk Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{score}</span>
              <span className="text-[#bec6e0] text-xs">/100</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#bec6e0] mb-1 font-semibold">Recommendation</p>
            <span className={`px-4 py-1.5 rounded font-black text-sm text-black ${
              rating === "BUY" ? "bg-green-400" : rating === "SELL" ? "bg-red-400" : "bg-amber-400"
            }`}>
              {rating}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-700/50">
          {getRationale(symbol).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className={`material-symbols-outlined text-sm mt-0.5 ${
                rating === "BUY" ? "text-green-400" : rating === "SELL" ? "text-red-400" : "text-amber-400"
              }`}>
                {rating === "SELL" ? "cancel" : "check_circle"}
              </span>
              <p className="text-[#bec6e0] leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderBookWidget = () => {
  const { selectedStock } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);

  const symbol = selectedStock?.symbol || "AAPL";
  const livePrice = prices[symbol]?.price ?? 212.5;

  // Generate ask/bid price spreads dynamically
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
        {/* Asks (Sell Orders) */}
        <div className="p-sm space-y-1 bg-red-50/20 border-r border-[#f2f4f6]">
          {asks.map((ask, idx) => (
            <div key={idx} className="flex justify-between text-red-700">
              <span>₹{ask.price.toFixed(2)}</span>
              <span>{ask.qty}</span>
            </div>
          ))}
        </div>
        {/* Bids (Buy Orders) */}
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
          <CandlestickChart />
          <HoldingsTable />
          <TransactionHistoryTable />
        </div>

        {/* Right Sidebar Widgets: Stock Details + AI Analysis + Order Book (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <StockDetails />
          <AIRecommendationWidget />
          <OrderBookWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;