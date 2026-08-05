import React from "react";
import useMarketStore from "../../store/marketStore";

const PositionRow = React.memo(({ h, pendingOrders, totalPortfolioValue, getSector, getSectorStyle }) => {
  const livePriceData = useMarketStore((state) => state.prices[h.symbol]);
  const livePrice = livePriceData?.price ?? h.averagePrice;
  
  const value = livePrice * h.quantity;
  const cost = h.averagePrice * h.quantity;
  const pnl = value - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  
  const allocPct = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;
  const sector = getSector(h.symbol);
  const style = getSectorStyle(sector);

  // Find SL and TP orders for this holding
  const slOrder = pendingOrders.find(o => o.symbol === h.symbol && o.orderType === "STOP_LOSS" && o.side === "SELL");
  const tpOrder = pendingOrders.find(o => o.symbol === h.symbol && o.orderType === "TAKE_PROFIT" && o.side === "SELL");

  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-lg py-md border-b border-outline-variant/30">
        <div className="flex items-center gap-sm">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${style.bg}`}>
            <span className="material-symbols-outlined text-sm font-bold">{style.icon}</span>
          </div>
          <div>
            <p className="font-bold text-[#0f172a]">{h.companyName}</p>
            <p className="text-[10px] font-data-mono text-slate-400 uppercase">{h.symbol}</p>
          </div>
        </div>
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 font-data-mono text-slate-700">
        {h.quantity} Shares
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right font-data-mono text-slate-700">
        ₹{h.averagePrice.toFixed(2)}
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right font-data-mono text-[#0f172a]">
        ₹{livePrice.toFixed(2)}
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right">
        {slOrder ? (
          <span className="font-data-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
            ₹{slOrder.triggerPrice?.toFixed(2)}
          </span>
        ) : (
          <span className="text-slate-300 text-[10px] uppercase font-bold">None</span>
        )}
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right">
        {tpOrder ? (
          <span className="font-data-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
            ₹{tpOrder.triggerPrice?.toFixed(2)}
          </span>
        ) : (
          <span className="text-slate-300 text-[10px] uppercase font-bold">None</span>
        )}
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right">
        <span className={`font-data-mono ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
          {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
        </span>
        <p className={`text-[10px] font-data-mono ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
          {pnl >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%
        </p>
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right align-middle">
        <div className="flex items-center gap-2 justify-end">
          <span className="font-data-mono text-[10px] text-slate-500">{allocPct.toFixed(0)}%</span>
          <div className="w-16 bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${style.color}`} style={{ width: `${allocPct}%` }}></div>
          </div>
        </div>
      </td>
      <td className="px-lg py-md border-b border-outline-variant/30 text-right">
        <button className="px-3 py-1 bg-surface-container hover:bg-black hover:text-white rounded text-[10px] font-bold uppercase transition-colors mr-2 cursor-pointer">
          Buy
        </button>
        <button className="px-3 py-1 bg-surface-container hover:bg-black hover:text-white rounded text-[10px] font-bold uppercase transition-colors cursor-pointer">
          Sell
        </button>
      </td>
    </tr>
  );
});

export default PositionRow;
