import { useEffect, useState } from "react";
import usePortfolioStore from "../store/portfolioStore";
import ModifyOrderModal from "../components/Orders/ModifyOrderModal";
import { cancelOrder } from "../services/tradingApi";
import AnalyticsDashboard from "../components/Dashboard/AnalyticsDashboard";
import OrderTimeline from "../components/Dashboard/OrderTimeline";

function Orders() {
  const { pendingOrders, orderHistory, fetchDashboard } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [modifyingOrder, setModifyingOrder] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const executedOrders = orderHistory.filter(o => o.status === "EXECUTED" || o.status === "COMPLETED");
  const cancelledOrders = orderHistory.filter(o => o.status === "CANCELLED" || o.status === "REJECTED");

  const renderTable = (orders, isPending) => (
    <div className="overflow-x-auto border border-[#e2e8f0] rounded-[4px] mt-4 font-sans">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</th>
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset</th>
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Quantity</th>
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Req. Price</th>
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Exec. Price</th>
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
            {isPending && <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f2f4f6] text-xs font-medium text-slate-700 bg-white">
          {orders.length > 0 ? (
            orders.map((o) => (
              <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-[10px] text-slate-400 font-normal">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="p-3">
                  <span className="font-bold text-[#0f172a]">{o.symbol}</span>
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold text-[10px] ${o.side === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>
                      {o.side}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{o.orderType}</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-right text-slate-500">{o.quantity}</td>
                <td className="p-3 font-mono text-right text-slate-500">
                  {o.requestedPrice || o.triggerPrice ? `₹${(o.requestedPrice || o.triggerPrice).toFixed(2)}` : "-"}
                </td>
                <td className="p-3 font-mono text-right font-bold text-[#0f172a]">
                  {o.executedPrice ? `₹${o.executedPrice.toFixed(2)}` : "-"}
                </td>
                <td className="p-3">
                  <span className={`inline-block px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider ${
                    o.status === "EXECUTED" || o.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-700"
                      : o.status === "PENDING"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                  }`}>
                    {o.status}
                  </span>
                </td>
                {isPending && (
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setModifyingOrder(o)}
                        className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded transition"
                      >
                        Modify
                      </button>
                      <button 
                        onClick={() => handleCancel(o._id)}
                        className="text-rose-600 hover:text-rose-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isPending ? 8 : 7} className="p-8 text-center text-xs text-slate-400 font-medium">
                {isPending ? "No pending orders. Market orders execute immediately." : "No orders found in this category."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Management</p>
        <h2 className="text-xl font-bold text-[#0f172a] mt-1 tracking-tight">Order Book</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Track and manage your active and historical orders.
        </p>
      </div>

      <div className="flex gap-4 border-b border-[#e2e8f0]">
        <button
          className={`py-2 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === "PENDING" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("PENDING")}
        >
          Pending
        </button>
        <button
          className={`py-2 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === "EXECUTED" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("EXECUTED")}
        >
          Executed
        </button>
        <button
          className={`py-2 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === "CANCELLED" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("CANCELLED")}
        >
          Cancelled / Rejected
        </button>
        <button
          className={`py-2 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === "ANALYTICS" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("ANALYTICS")}
        >
          Analytics & Timeline
        </button>
      </div>

      {activeTab === "PENDING" && renderTable(pendingOrders, true)}
      {activeTab === "EXECUTED" && renderTable(executedOrders, false)}
      {activeTab === "CANCELLED" && renderTable(cancelledOrders, false)}
      {activeTab === "ANALYTICS" && (
        <div className="pt-4">
          <AnalyticsDashboard />
          <OrderTimeline />
        </div>
      )}

      <ModifyOrderModal
        isOpen={!!modifyingOrder}
        order={modifyingOrder}
        onClose={() => setModifyingOrder(null)}
      />
    </div>
  );
}

export default Orders;
