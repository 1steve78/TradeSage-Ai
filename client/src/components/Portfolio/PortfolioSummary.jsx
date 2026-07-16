import usePortfolioStore from "../../store/portfolioStore";
import useMarketStore from "../../store/marketStore";

const PortfolioSummary = () => {
  const { portfolio } = usePortfolioStore();
  const prices = useMarketStore((state) => state.prices);

  const cash = portfolio?.cash ?? 0;
  const holdings = portfolio?.holdings ?? [];

  // Calculate current value of holdings based on live prices
  let totalInvested = 0;
  let totalCurrentVal = 0;

  holdings.forEach((holding) => {
    const livePrice = prices[holding.symbol]?.price ?? holding.averagePrice;
    totalInvested += holding.averagePrice * holding.quantity;
    totalCurrentVal += livePrice * holding.quantity;
  });

  const totalValue = cash + totalCurrentVal;
  const overallPnL = totalCurrentVal - totalInvested;
  const overallPnLPct = totalInvested > 0 ? (overallPnL / totalInvested) * 100 : 0;

  return (
    <section className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md mb-xs font-sans">
      {/* Total Value */}
      <div className="glass-card p-md rounded flex flex-col justify-between min-h-[90px]">
        <span className="text-slate-500 text-xs font-medium">Total Value</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-data-mono text-lg font-bold text-[#0f172a] tracking-tight">
            ₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {totalInvested > 0 && (
            <span className={`font-data-mono text-[10px] font-bold ${overallPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {overallPnL >= 0 ? "+" : ""}{overallPnLPct.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Today's P&L */}
      <div className="glass-card p-md rounded flex flex-col justify-between min-h-[90px]">
        <span className="text-slate-500 text-xs font-medium">Today's P&amp;L</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`font-data-mono text-lg font-bold tracking-tight ${
            overallPnL >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {overallPnL >= 0 ? "+₹" : "-₹"}{Math.abs(overallPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`material-symbols-outlined text-sm font-bold ${
            overallPnL >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {overallPnL >= 0 ? "trending_up" : "trending_down"}
          </span>
        </div>
      </div>

      {/* Cash Available */}
      <div className="glass-card p-md rounded flex flex-col justify-between min-h-[90px]">
        <span className="text-slate-500 text-xs font-medium">Cash Available</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-data-mono text-lg font-bold text-[#0f172a] tracking-tight">
            ₹{cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Invested Capital */}
      <div className="glass-card p-md rounded flex flex-col justify-between min-h-[90px]">
        <span className="text-slate-500 text-xs font-medium">Invested Capital</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-data-mono text-lg font-bold text-[#0f172a] tracking-tight">
            ₹{totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSummary;
