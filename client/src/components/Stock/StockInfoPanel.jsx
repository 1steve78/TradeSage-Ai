import { motion, AnimatePresence } from "framer-motion";
import useTradingStore from "../../store/tradingStore";
import { useCompanyInfo } from "../../hooks/useCompanyInfo";

import PriceCard from "./PriceCard";
import CompanyInfo from "./CompanyInfo";
import MarketStats from "./MarketStats";

const StockInfoPanel = () => {
  const { selectedStock, openBuy, openSell } = useTradingStore();
  const { data: companyInfo, isLoading } = useCompanyInfo(selectedStock);

  return (
    <div className="flex flex-col h-full min-h-[360px]">
      <AnimatePresence mode="wait">
        {!selectedStock ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 bg-white border border-[#e2e8f0] rounded-[4px]"
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
            className="flex-1 flex flex-col"
          >
            <PriceCard stock={selectedStock} />
            <CompanyInfo info={companyInfo} isLoading={isLoading} />
            <MarketStats stock={selectedStock} info={companyInfo} isLoading={isLoading} />

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
            <div className="flex gap-2 mt-auto">
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

export default StockInfoPanel;
