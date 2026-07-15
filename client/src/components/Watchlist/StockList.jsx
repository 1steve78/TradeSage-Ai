import useWatchlistStore from "../../store/watchlistStore";
import StockCard from "./StockCard";

const StockList = () => {
  const { selectedWatchlist } =
    useWatchlistStore();

  if (!selectedWatchlist) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined text-[48px] text-slate-600 mb-2">
          folder_open
        </span>
        <p className="text-slate-400 font-medium">Select a watchlist to display stocks</p>
        <p className="text-xs text-slate-500 mt-1">Create or select a watchlist from the left sidebar</p>
      </div>
    );
  }

  if (selectedWatchlist.stocks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            {selectedWatchlist.name}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-400">
            0 Symbols
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center bg-white/5 border border-white/5 rounded-2xl">
          <span className="material-symbols-outlined text-[36px] text-slate-500 mb-2">
            add_chart
          </span>
          <p className="text-slate-400 text-sm font-medium">No stocks in this watchlist</p>
          <p className="text-xs text-slate-500 mt-1">Use the search bar above to find and add symbols</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white tracking-wide">
          {selectedWatchlist.name}
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200">
          {selectedWatchlist.stocks.length} {selectedWatchlist.stocks.length === 1 ? 'Symbol' : 'Symbols'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedWatchlist.stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;