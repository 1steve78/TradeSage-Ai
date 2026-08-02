import { cancelOrder } from "../../services/tradingApi";
import useMarketStore from "../../store/marketStore";

const PendingOrders = ({ orders = [], onCancelSuccess }) => {
  const prices = useMarketStore((state) => state.prices);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      if (onCancelSuccess) onCancelSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  if (orders.length === 0) return null;

  return (
    <div className="glass-card rounded-xl overflow-hidden bg-white border border-[#e2e8f0] mt-8">
      <div className="px-lg py-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
        <h2 className="font-title-sm text-sm text-[#0f172a] font-bold">Pending Limit Orders</h2>
      </div>
      
      <table className="w-full border-collapse font-sans text-left">
        <thead className="bg-surface-container-lowest text-left font-label-caps text-[10px] text-slate-400 uppercase tracking-wider font-bold">
          <tr>
            <th className="px-lg py-sm border-b border-[#e2e8f0]">Symbol</th>
            <th className="px-lg py-sm border-b border-[#e2e8f0]">Type</th>
            <th className="px-lg py-sm border-b border-[#e2e8f0]">Quantity</th>
            <th className="px-lg py-sm border-b border-[#e2e8f0]">Limit/Trigger Price</th>
            <th className="px-lg py-sm border-b border-[#e2e8f0]">Current Price</th>
            <th className="px-lg py-sm border-b border-[#e2e8f0] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs font-semibold">
          {orders.map((order) => {
            const currentPrice = prices[order.symbol]?.price ?? 0;
            return (
              <tr key={order._id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-lg py-md border-b border-outline-variant/30 font-bold text-[#0f172a]">
                  {order.symbol}
                </td>
                <td className="px-lg py-md border-b border-outline-variant/30">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.side === "BUY" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {order.side}
                  </span>
                </td>
                <td className="px-lg py-md border-b border-outline-variant/30 font-data-mono text-slate-700">
                  {order.quantity}
                </td>
                <td className="px-lg py-md border-b border-outline-variant/30 font-data-mono text-slate-700">
                  ₹{(order.requestedPrice || order.triggerPrice)?.toFixed(2)}
                </td>
                <td className="px-lg py-md border-b border-outline-variant/30 font-data-mono text-[#0f172a]">
                  ₹{currentPrice.toFixed(2)}
                </td>
                <td className="px-lg py-md border-b border-outline-variant/30 text-right">
                  <button 
                    onClick={() => handleCancel(order._id)}
                    className="text-rose-600 hover:text-rose-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-rose-50 hover:bg-rose-100 rounded transition"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingOrders;
