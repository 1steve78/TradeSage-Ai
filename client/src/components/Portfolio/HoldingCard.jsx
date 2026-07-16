import useTradingStore from "../../store/tradingStore";
import useMarketStore from "../../store/marketStore";

const HoldingCard = ({ holding }) => {
  const { selectStock, openBuy, openSell } = useTradingStore();
  const prices = useMarketStore((state) => state.prices);

  const { symbol, companyName, quantity, averagePrice } = holding;
  
  // Fetch real-time price
  const livePrice = prices[symbol]?.price ?? averagePrice;
  const currentVal = livePrice * quantity;
  const totalCost = averagePrice * quantity;
  const pnl = currentVal - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

  const handleRowClick = () => {
    selectStock({ symbol, companyName });
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="border-b border-[#f2f4f6] last:border-0 hover:bg-slate-50 transition cursor-pointer"
    >
      <td className="p-4 align-middle">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#0f172a]">{symbol}</span>
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{companyName}</span>
        </div>
      </td>
      <td className="p-4 align-middle text-right font-mono text-xs text-slate-700">
        {quantity}
      </td>
      <td className="p-4 align-middle text-right font-mono text-xs text-slate-700">
        ${averagePrice.toFixed(2)}
      </td>
      <td className="p-4 align-middle text-right font-mono text-xs text-[#0f172a]">
        ${livePrice.toFixed(2)}
      </td>
      <td className="p-4 align-middle text-right font-mono text-xs font-bold text-[#0f172a]">
        ${currentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="p-4 align-middle text-right">
        <div className="flex flex-col items-end">
          <span className={`font-mono text-xs font-bold ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {pnl >= 0 ? "+" : ""}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`font-mono text-[9px] font-bold ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {pnl >= 0 ? "▲" : "▼"} {Math.abs(pnlPct).toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="p-4 align-middle text-right">
        <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              selectStock({ symbol, companyName });
              openBuy();
            }}
            className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded-[2px] border border-emerald-200 transition cursor-pointer"
          >
            Buy More
          </button>
          <button
            onClick={() => {
              selectStock({ symbol, companyName });
              openSell();
            }}
            className="text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-1 rounded-[2px] border border-rose-200 transition cursor-pointer"
          >
            Sell
          </button>
        </div>
      </td>
    </tr>
  );
};

export default HoldingCard;
