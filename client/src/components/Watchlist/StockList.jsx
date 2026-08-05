import useWatchlistStore from "../../store/watchlistStore";
import StockCard from "./StockCard";
import { EmptyState } from "../common/Skeletons";
import { FolderOpen, TrendingUp } from "lucide-react";

const StockList = () => {
  const { selectedWatchlist } =
    useWatchlistStore();

  if (!selectedWatchlist) {
    return (
      <EmptyState 
        icon={FolderOpen}
        title="Select a watchlist to display stocks"
        description="Create or select a watchlist from the left sidebar"
      />
    );
  }

  if (selectedWatchlist.stocks.length === 0) {
    return (
      <div className="space-y-6 bg-white border border-gray-100 rounded-custom p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-brand tracking-tight">
            {selectedWatchlist.name}
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            0 Symbols
          </span>
        </div>

        <EmptyState 
          icon={TrendingUp}
          title="No stocks in this watchlist"
          description="Use the search bar above to find and add symbols"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white border border-gray-100 rounded-custom p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-brand tracking-tight">
          {selectedWatchlist.name}
        </h2>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-low border border-gray-200 text-brand">
          {selectedWatchlist.stocks.length} {selectedWatchlist.stocks.length === 1 ? 'Symbol' : 'Symbols'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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