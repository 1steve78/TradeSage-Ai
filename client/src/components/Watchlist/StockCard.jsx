import React from "react";
import useWatchlistStore from "../../store/watchlistStore";
import useMarketStore from "../../store/marketStore";
import { useNavigate } from "react-router-dom";

const StockCard = React.memo(({ stock }) => {
  const navigate = useNavigate();
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
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:shadow-sm cursor-pointer ${
        direction === "up"
          ? "border-success/30 bg-success/5"
          : direction === "down"
          ? "border-danger/30 bg-danger/5"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand tracking-tight">
            {stock.symbol}
          </span>
          {price && (
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
              direction === "up"
                ? "bg-success"
                : direction === "down"
                ? "bg-danger"
                : "bg-gray-400"
            }`}></span>
          )}
        </div>
        <p className="text-xs text-gray-500 font-medium mt-1">
          {stock.companyName}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {price ? (
          <div className="text-right">
            <p className="font-mono font-bold text-brand text-sm">
              ${price.toFixed(2)}
            </p>
            <p
              className={`text-[10px] font-bold mt-0.5 flex items-center justify-end gap-0.5 ${
                direction === "up"
                  ? "text-success"
                  : direction === "down"
                  ? "text-danger"
                  : "text-gray-500"
              }`}
            >
              {direction === "up" ? "▲" : direction === "down" ? "▼" : "•"}
              <span className="uppercase text-[9px] font-bold tracking-wider text-gray-500 ml-1">Live</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 font-medium">Offline</p>
        )}

        <button
          onClick={handleRemove}
          className="rounded-lg bg-gray-50 border border-gray-200 text-gray-400 px-3 py-1.5 text-xs font-bold hover:bg-danger/10 hover:border-danger/20 hover:text-danger transition duration-200 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

export default StockCard;