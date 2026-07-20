import useMarketStore from "../../store/marketStore";

const PriceCard = ({ stock }) => {
  const prices = useMarketStore((state) => state.prices);
  
  if (!stock) return null;

  const symbol = stock.symbol;
  const name = stock.companyName || symbol;
  
  const livePriceData = prices[symbol];
  const currentPrice = livePriceData?.price ?? null;
  const previousPrice = livePriceData?.previousPrice ?? null;
  
  const change = currentPrice && previousPrice ? currentPrice - previousPrice : 0;
  const pctChange = previousPrice ? (change / previousPrice) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className="bg-white border border-[#e2e8f0] p-lg rounded mb-md shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display-lg text-lg text-[#0f172a] font-bold">
            {name}
          </h2>
          <div className="flex items-center gap-sm mt-1">
            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"></span>
              LIVE
            </span>
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              {stock.exchange || "EQUITY"} • {symbol}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-sm">
        <span className="font-data-mono text-[28px] font-bold text-[#0f172a]">
          {currentPrice ? `₹${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "--"}
        </span>
        {currentPrice && previousPrice && (
          <span className={`font-data-mono text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}₹{change.toFixed(2)} ({isPositive ? "+" : ""}{pctChange.toFixed(2)}%)
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceCard;
