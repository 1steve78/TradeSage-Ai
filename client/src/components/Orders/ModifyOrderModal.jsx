import { useState, useEffect } from "react";
import { modifyOrder } from "../../services/tradingApi";
import usePortfolioStore from "../../store/portfolioStore";

const ModifyOrderModal = ({ order, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(order?.quantity || 1);
  const [price, setPrice] = useState(order?.requestedPrice || order?.triggerPrice || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { fetchDashboard } = usePortfolioStore();

  useEffect(() => {
    if (order) {
      setQuantity(order.quantity);
      setPrice(order.requestedPrice || order.triggerPrice || "");
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const isProtective = order.orderType === "STOP_LOSS" || order.orderType === "TAKE_PROFIT";
  const isLimit = order.orderType === "LIMIT";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updates = { quantity: Number(quantity) };
      if (isLimit) updates.requestedPrice = Number(price);
      if (isProtective) updates.triggerPrice = Number(price);

      await modifyOrder(order._id, updates);
      await fetchDashboard();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-[#e2e8f0] flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h3 className="font-title-sm text-[#0f172a] font-bold">Modify Order</h3>
            <p className="text-[10px] text-slate-500 font-medium">
              {order.side} {order.orderType} • {order.symbol}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <span className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-sm font-semibold text-[#0f172a] bg-[#f2f4f6] rounded-[4px] border border-transparent px-4 py-3 outline-none focus:border-[#0f172a] focus:bg-white transition-all font-mono"
            />
          </div>

          {(isLimit || isProtective) && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {isProtective ? (order.orderType === "STOP_LOSS" ? "Trigger Price" : "Target Price") : "Limit Price"}
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm font-semibold text-[#0f172a] bg-[#f2f4f6] rounded-[4px] border border-transparent px-4 py-3 outline-none focus:border-[#0f172a] focus:bg-white transition-all font-mono"
              />
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-[4px] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white text-xs font-bold uppercase tracking-wider py-3 rounded transition bg-[#0f172a] hover:bg-[#1e293b] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Updating...
                </>
              ) : (
                "Update Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyOrderModal;
