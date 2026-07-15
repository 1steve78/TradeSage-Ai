import useWatchlistStore from "../../store/watchlistStore";
import useMarketStore from "../../store/marketStore";

const StockCard = ({ stock }) => {
  const { selectedWatchlist, removeStock } = useWatchlistStore();
  const livePriceData = useMarketStore((state) => state.prices[stock.symbol]);

  const price = livePriceData?.price ?? null;
  const previousPrice = livePriceData?.previousPrice ?? null;

  const direction =
    price && previousPrice
      ? price > previousPrice
        ? "up"
        : price < previousPrice
        ? "down"
        : "same"
      : "same";

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (!selectedWatchlist) return;

    await removeStock(selectedWatchlist._id, stock.symbol);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:bg-white/10 ${
        direction === "up"
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          : direction === "down"
          ? "border-rose-500/40 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">
            {stock.symbol}
          </span>
          {price && (
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
              direction === "up"
                ? "bg-emerald-500"
                : direction === "down"
                ? "bg-rose-500"
                : "bg-slate-500"
            }`}></span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {stock.companyName}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {price ? (
          <div className="text-right">
            <p className="font-mono font-semibold text-white text-sm">
              ${price.toFixed(2)}
            </p>
            <p
              className={`text-[10px] font-bold mt-0.5 flex items-center justify-end gap-0.5 ${
                direction === "up"
                  ? "text-emerald-400"
                  : direction === "down"
                  ? "text-rose-400"
                  : "text-slate-500"
              }`}
            >
              {direction === "up" ? "▲" : direction === "down" ? "▼" : "•"}
              <span className="uppercase text-[9px] font-medium tracking-wider text-slate-500 ml-1">Live</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Offline</p>
        )}

        <button
          onClick={handleRemove}
          className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 text-xs font-semibold hover:bg-red-500/20 hover:text-white transition duration-200 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default StockCard;