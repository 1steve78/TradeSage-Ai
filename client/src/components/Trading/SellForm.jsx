import { useState } from "react";
import useTradingStore from "../../store/tradingStore";
import useMarketStore from "../../store/marketStore";
import usePortfolioStore from "../../store/portfolioStore";

const SellForm = () => {
  const [quantity, setQuantity] = useState(1);
  const [localError, setLocalError] = useState(null);
  const { selectedStock, closeModal } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);
  const { portfolio, sellStock, loading: tradeLoading } = usePortfolioStore();

  const currentPrice = selectedStock ? (prices[selectedStock.symbol]?.price ?? 0) : 0;
  
  // Find current holding for validation
  const holding = portfolio?.holdings?.find(h => h.symbol === selectedStock.symbol);
  const ownedShares = holding?.quantity ?? 0;
  const estimatedRevenue = currentPrice * quantity;
  const hasSufficientShares = ownedShares >= quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (quantity <= 0) {
      setLocalError("Quantity must be greater than 0");
      return;
    }

    if (!hasSufficientShares) {
      setLocalError(`Insufficient shares. You only own ${ownedShares} shares`);
      return;
    }

    const res = await sellStock(selectedStock.symbol, selectedStock.companyName, Number(quantity));
    if (res.success) {
      closeModal();
    } else {
      setLocalError(res.error || "Failed to complete transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Shares Quantity
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

      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] p-4 space-y-2.5 text-xs font-semibold text-slate-600">
        <div className="flex justify-between">
          <span>Market Price</span>
          <span className="font-mono text-[#0f172a]">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Owned Shares</span>
          <span className="font-mono text-[#0f172a]">{ownedShares}</span>
        </div>
        <div className="border-t border-[#e2e8f0] pt-2.5 flex justify-between font-bold text-slate-700">
          <span>Est. Credit</span>
          <span className="font-mono text-[#0f172a]">${estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
        disabled={tradeLoading || !hasSufficientShares || ownedShares === 0}
        className="w-full bg-[#ef4444] disabled:bg-[#fca5a5] hover:bg-[#dc2626] disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
      >
        {tradeLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Executing Trade...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm font-bold">sell</span>
            Confirm Sell Order
          </>
        )}
      </button>
    </form>
  );
};

export default SellForm;
