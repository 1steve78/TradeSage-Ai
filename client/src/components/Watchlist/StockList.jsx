import useWatchlistStore from "../../store/watchlistStore";
import StockCard from "./StockCard";

const StockList = () => {
  const { selectedWatchlist } =
    useWatchlistStore();

  if (!selectedWatchlist) {
    return (
      <div className="flex h-full items-center justify-center">

        <p className="text-gray-500">
          Select a watchlist
        </p>

      </div>
    );
  }

  if (
    selectedWatchlist.stocks.length === 0
  ) {
    return (
      <div className="p-6">

        <h2 className="mb-4 text-2xl font-bold">
          {selectedWatchlist.name}
        </h2>

        <p className="text-gray-500">
          No stocks in this watchlist.
        </p>

      </div>
    );
  }

  return (
    <div className="p-6">

      <h2 className="mb-6 text-2xl font-bold">
        {selectedWatchlist.name}
      </h2>

      <div className="space-y-4">

        {selectedWatchlist.stocks.map(
          (stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
            />
          )
        )}

      </div>

    </div>
  );
};

export default StockList;