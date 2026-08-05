import WatchlistHeader from "../components/Watchlist/WatchlistHeader";
import StockList from "../components/Watchlist/StockList";

function Watchlist() {
  return (
    <div className="flex flex-col h-full bg-surface-lowest rounded-custom overflow-hidden shadow-sm border border-gray-100">
      <WatchlistHeader />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
        <StockList />
      </div>
    </div>
  );
}

export default Watchlist;
