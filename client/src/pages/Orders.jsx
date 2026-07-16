import { useEffect } from "react";
import usePortfolioStore from "../store/portfolioStore";

function Orders() {
  const { transactions, fetchTransactions } = usePortfolioStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Logs</p>
        <h2 className="text-xl font-bold text-[#0f172a] mt-1 tracking-tight">Trade History & Executions</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Historical log of all successfully filled and failed orders on this account.
        </p>
      </div>

      <div className="overflow-x-auto border-t border-[#f2f4f6] pt-4 font-sans">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Quantity</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Value</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6] text-xs font-medium text-slate-700">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-400 font-normal">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0f172a]">{tx.symbol}</span>
                      <span className="text-[10px] text-slate-400">{tx.companyName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${tx.type === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-right">${tx.price.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right text-slate-500">{tx.quantity}</td>
                  <td className="p-4 font-mono text-right font-bold">${tx.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4">
                    <span className={`inline-block px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                      tx.status === "SUCCESS"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-xs text-slate-400 font-medium">
                  No orders have been executed on this account yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
