const RecentTrades = () => {
  const executions = [
    { asset: "ETH/USDT", type: "BUY", price: 3492.10, amount: "1.40 ETH", total: 4888.94, status: "FILLED" },
    { asset: "SOL/USDT", type: "SELL", price: 142.55, amount: "50.00 SOL", total: 7127.50, status: "FILLED" },
    { asset: "BTC/USDT", type: "BUY", price: 67100.00, amount: "0.05 BTC", total: 3355.00, status: "PARTIAL" },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Recent Trade Executions
        </h3>
        <a href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition underline">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th className="p-3 text-[10px] font-bold text-[#0f172a] uppercase tracking-wider">Asset</th>
              <th className="p-3 text-[10px] font-bold text-[#0f172a] uppercase tracking-wider">Type</th>
              <th className="p-3 text-[10px] font-bold text-[#0f172a] uppercase tracking-wider">Price</th>
              <th className="p-3 text-[10px] font-bold text-[#0f172a] uppercase tracking-wider">Amount</th>
              <th className="p-3 text-[10px] font-bold text-[#0f172a] uppercase tracking-wider">Total</th>
              <th className="p-3 text-[10px] font-bold text-[#0f172a] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-slate-700">
            {executions.map((trade, idx) => (
              <tr key={idx} className="border-b border-[#f2f4f6] hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold text-[#0f172a]">{trade.asset}</td>
                <td className="p-3">
                  <span className={`font-bold ${trade.type === "BUY" ? "text-emerald-600" : "text-rose-600"}`}>
                    {trade.type}
                  </span>
                </td>
                <td className="p-3 font-mono">${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-3 font-mono text-slate-500">{trade.amount}</td>
                <td className="p-3 font-mono">${trade.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-3">
                  <span className={`inline-block px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                    trade.status === "FILLED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrades;
