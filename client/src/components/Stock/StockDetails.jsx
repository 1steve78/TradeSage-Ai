import { motion, AnimatePresence } from "framer-motion";
import useTradingStore from "../../store/tradingStore";
import useMarketStore from "../../store/marketStore";

const StockDetails = () => {
  const { selectedStock, openBuy, openSell } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);
  
  // Find live price from market store if available
  const livePriceData = selectedStock ? prices[selectedStock.symbol] : null;
  const currentPrice = livePriceData?.price ?? null;
  const previousPrice = livePriceData?.previousPrice ?? null;
  
  const change = currentPrice && previousPrice ? currentPrice - previousPrice : 0;
  const pctChange = previousPrice ? (change / previousPrice) * 100 : 0;

  // Dynamically calculate metrics based on live price for high fidelity
  const openVal = currentPrice ? currentPrice * 0.995 : 0;
  const prevCloseVal = currentPrice ? currentPrice * 0.992 : 0;
  const highVal = currentPrice ? Math.max(currentPrice, openVal) * 1.008 : 0;
  const lowVal = currentPrice ? Math.min(currentPrice, openVal) * 0.991 : 0;
  
  // Static metrics based on ticker symbol
  const getVolume = (sym) => {
    if (sym === "AAPL") return "4.2M";
    if (sym === "TSLA") return "12.8M";
    if (sym === "NVDA") return "22.4M";
    if (sym === "MSFT") return "5.1M";
    if (sym === "BTC") return "84K";
    return "1.5M";
  };

  const getMktCap = (sym) => {
    if (sym === "AAPL") return "2.8T";
    if (sym === "TSLA") return "620B";
    if (sym === "NVDA") return "2.2T";
    if (sym === "MSFT") return "3.1T";
    if (sym === "BTC") return "1.3T";
    return "180B";
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 h-full flex flex-col justify-between min-h-[360px]">
      <AnimatePresence mode="wait">
        {!selectedStock ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4"
          >
            <span className="material-symbols-outlined text-[48px] text-slate-300">
              corporate_fare
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                No Stock Selected
              </h3>
              <p className="text-[11px] text-slate-400 font-medium max-w-[200px] mt-1.5 leading-relaxed">
                Select a stock from watchlists or search to view pricing metrics and trade.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={selectedStock.symbol}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Title and live price info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-headline-md text-lg text-[#0f172a] leading-tight font-bold">
                  {selectedStock.companyName}
                </h2>
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                  Equity • {selectedStock.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="font-data-mono text-headline-md text-[#0f172a] font-bold text-lg leading-none">
                  {currentPrice ? `₹${currentPrice.toFixed(2)}` : "--"}
                </p>
                {currentPrice && (
                  <p className={`font-data-mono text-[10px] font-semibold mt-1 ${
                    change >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {change >= 0 ? "+" : ""}₹{change.toFixed(2)} ({change >= 0 ? "▲" : "▼"}{Math.abs(pctChange).toFixed(2)}%)
                  </p>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-y-sm gap-x-gutter py-md border-y border-outline-variant/30 my-md text-xs font-semibold text-slate-600">
              <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
                <span className="text-slate-400 text-[11px]">Open</span>
                <span className="font-data-mono text-[#0f172a]">{openVal ? `₹${openVal.toFixed(2)}` : "--"}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
                <span className="text-slate-400 text-[11px]">Prev Close</span>
                <span className="font-data-mono text-[#0f172a]">{prevCloseVal ? `₹${prevCloseVal.toFixed(2)}` : "--"}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
                <span className="text-slate-400 text-[11px]">High</span>
                <span className="font-data-mono text-green-600">{highVal ? `₹${highVal.toFixed(2)}` : "--"}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
                <span className="text-slate-400 text-[11px]">Low</span>
                <span className="font-data-mono text-red-600">{lowVal ? `₹${lowVal.toFixed(2)}` : "--"}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
                <span className="text-slate-400 text-[11px]">Volume</span>
                <span className="font-data-mono text-[#0f172a]">{getVolume(selectedStock.symbol)}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
                <span className="text-slate-400 text-[11px]">Mkt Cap</span>
                <span className="font-data-mono text-[#0f172a]">{getMktCap(selectedStock.symbol)}</span>
              </div>
            </div>

            {/* Trade Order Actions */}
            <div className="grid grid-cols-2 gap-sm mb-md">
              <button 
                onClick={openBuy}
                className="bg-black text-white py-3 rounded text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">payments</span>
                BUY
              </button>
              <button 
                onClick={openSell}
                className="bg-white border border-black text-primary py-3 rounded text-xs font-bold hover:bg-surface-container active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">sell</span>
                SELL
              </button>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="flex gap-2">
              <button className="flex-1 bg-surface-container hover:bg-slate-200 py-2 rounded text-[10px] font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                <span className="material-symbols-outlined text-sm text-[#0f172a]">notifications_active</span> Alert
              </button>
              <button className="flex-1 bg-surface-container hover:bg-slate-200 py-2 rounded text-[10px] font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                <span className="material-symbols-outlined text-sm text-[#0f172a]">star</span> Watchlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockDetails;
