import { motion, AnimatePresence } from "framer-motion";
import useTradingStore from "../../store/tradingStore";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

const TradeModal = () => {
  const { isTradeModalOpen, tradeType, selectedStock, closeModal } = useTradingStore();

  if (!isTradeModalOpen || !selectedStock) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal content card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative bg-white border border-[#e2e8f0] w-full max-w-md rounded-[4px] shadow-2xl p-6 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] text-white uppercase tracking-wider ${
                tradeType === "BUY" ? "bg-[#10b981]" : "bg-[#ef4444]"
              }`}>
                {tradeType} Stock
              </span>
              <h3 className="text-lg font-bold text-[#0f172a] mt-2.5">
                {selectedStock.companyName}
              </h3>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                {selectedStock.symbol}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-900 transition p-1 hover:bg-slate-50 rounded cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Render correct form */}
          {tradeType === "BUY" ? <BuyForm /> : <SellForm />}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TradeModal;
