import { useState } from "react";
import useTradingStore from "../../store/tradingStore";
import useMarketStore from "../../store/marketStore";
import usePortfolioStore from "../../store/portfolioStore";
import api from "../../api/axios";

const OrderForm = () => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("MARKET");
  const [limitPrice, setLimitPrice] = useState("");
  const [localError, setLocalError] = useState(null);
  
  const { selectedStock, closeModal, tradeType, setTradeType } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);
  
  const { portfolio, fetchPortfolio, fetchTransactions } = usePortfolioStore();
  const [tradeLoading, setTradeLoading] = useState(false);

  const currentPrice = selectedStock ? (prices[selectedStock.symbol]?.price ?? 0) : 0;
  
  const activePrice = orderType === "LIMIT" && limitPrice ? Number(limitPrice) : currentPrice;
  const estimatedCost = activePrice * quantity;
  
  const cashAvailable = portfolio?.cash ?? 0;
  const holding = portfolio?.holdings?.find(h => h.symbol === selectedStock?.symbol);
  const sharesOwned = holding?.quantity ?? 0;

  const isValidOrder = tradeType === "BUY" 
    ? cashAvailable >= estimatedCost
    : sharesOwned >= quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (quantity <= 0) {
      setLocalError("Quantity must be greater than 0");
      return;
    }
    
    if (orderType === "LIMIT" && (!limitPrice || limitPrice <= 0)) {
        setLocalError("Please enter a valid limit price");
        return;
    }
    if ((orderType === "STOP_LOSS" || orderType === "TAKE_PROFIT") && (!limitPrice || limitPrice <= 0)) {
        setLocalError("Please enter a valid target/trigger price");
        return;
    }

    if (!isValidOrder) {
      setLocalError(tradeType === "BUY" ? "Insufficient balance" : "Insufficient shares");
      return;
    }
    
    // Basic logical validation
    if (orderType === "STOP_LOSS" && tradeType === "SELL" && limitPrice >= currentPrice) {
      setLocalError("Sell Stop-Loss must be below current price.");
      return;
    }
    if (orderType === "TAKE_PROFIT" && tradeType === "SELL" && limitPrice <= currentPrice) {
      setLocalError("Sell Take-Profit must be above current price.");
      return;
    }

    setTradeLoading(true);
    try {
      await api.post("/orders", {
        symbol: selectedStock.symbol,
        companyName: selectedStock.companyName,
        quantity: Number(quantity),
        requestedPrice: orderType === "LIMIT" ? Number(limitPrice) : undefined,
        triggerPrice: (orderType === "STOP_LOSS" || orderType === "TAKE_PROFIT") ? Number(limitPrice) : undefined,
        side: tradeType,
        orderType: orderType
      });
      
      await fetchPortfolio();
      await fetchTransactions();
      
      closeModal();
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to complete order");
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      <div className="flex bg-slate-100 rounded-md p-1 font-bold text-sm">
        <button
          type="button"
          onClick={() => setTradeType("BUY")}
          className={`flex-1 py-2 rounded-sm transition ${tradeType === "BUY" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => setTradeType("SELL")}
          className={`flex-1 py-2 rounded-sm transition ${tradeType === "SELL" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          SELL
        </button>
      </div>

      <div className="flex bg-slate-100 rounded-md p-1 font-semibold text-[10px]">
        <button
          type="button"
          onClick={() => setOrderType("MARKET")}
          className={`flex-1 py-1.5 rounded-sm transition ${orderType === "MARKET" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          MARKET
        </button>
        <button
          type="button"
          onClick={() => setOrderType("LIMIT")}
          className={`flex-1 py-1.5 rounded-sm transition ${orderType === "LIMIT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          LIMIT
        </button>
        <button
          type="button"
          onClick={() => setOrderType("STOP_LOSS")}
          className={`flex-1 py-1.5 rounded-sm transition ${orderType === "STOP_LOSS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          STOP LOSS
        </button>
        <button
          type="button"
          onClick={() => setOrderType("TAKE_PROFIT")}
          className={`flex-1 py-1.5 rounded-sm transition ${orderType === "TAKE_PROFIT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          TAKE PROFIT
        </button>
      </div>

      <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(Math.max(1, parseInt(e.target.value) || 0));
                setLocalError(null);
              }}
              className="w-full text-sm font-semibold text-[#0f172a] bg-[#f2f4f6] rounded-[4px] border border-transparent px-4 py-3 outline-none focus:border-[#0f172a] focus:bg-white transition-all font-mono"
            />
          </div>
          
          {orderType !== "MARKET" && (
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {orderType === "LIMIT" ? "Limit Price" : orderType === "STOP_LOSS" ? "Trigger Price" : "Target Price"}
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => {
                    setLimitPrice(e.target.value);
                    setLocalError(null);
                  }}
                  placeholder={currentPrice.toFixed(2)}
                  className="w-full text-sm font-semibold text-[#0f172a] bg-[#f2f4f6] rounded-[4px] border border-transparent px-4 py-3 outline-none focus:border-[#0f172a] focus:bg-white transition-all font-mono"
                />
              </div>
          )}
      </div>

      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] p-4 space-y-2.5 text-xs font-semibold text-slate-600">
        <div className="flex justify-between">
          <span>Live Market Price</span>
          <span className="font-mono text-[#0f172a]">₹{currentPrice.toFixed(2)}</span>
        </div>
        
        {tradeType === "BUY" ? (
          <div className="flex justify-between">
            <span>Available Cash</span>
            <span className="font-mono text-[#0f172a]">₹{cashAvailable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>Shares Owned</span>
            <span className="font-mono text-[#0f172a]">{sharesOwned} Shares</span>
          </div>
        )}

        <div className="border-t border-[#e2e8f0] pt-2.5 flex justify-between font-bold text-slate-700">
          <span>{tradeType === "BUY" ? "Est. Cost" : "Est. Revenue"}</span>
          <span className="font-mono text-[#0f172a]">₹{estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {localError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-[4px] flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{localError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={tradeLoading || !isValidOrder}
        className={`w-full text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
          tradeType === "BUY" 
            ? "bg-[#10b981] hover:bg-[#059669] disabled:bg-[#86efac]"
            : "bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-[#fca5a5]"
        } disabled:cursor-not-allowed`}
      >
        {tradeLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Placing Order...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm font-bold">
              {tradeType === "BUY" ? "payments" : "storefront"}
            </span>
            {tradeType === "BUY" ? `Confirm Buy ${orderType}` : `Confirm Sell ${orderType}`}
          </>
        )}
      </button>
    </form>
  );
};

export default OrderForm;
