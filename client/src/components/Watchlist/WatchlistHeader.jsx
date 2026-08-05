import { useState, useEffect } from "react";
import useWatchlistStore from "../../store/watchlistStore";
import useMarketStore from "../../store/marketStore";
import { useSocket } from "../../context/SocketContext";
import CreateWatchlistModal from "./CreateWatchlistModel";
import { Folder, Trash2 } from "lucide-react";

const WatchlistHeader = () => {
  const {
    watchlists,
    selectedWatchlist,
    loading,
    error,
    fetchWatchlists,
    setSelectedWatchlist,
    deleteWatchlist,
  } = useWatchlistStore();

  const { joinWatchlist, leaveWatchlist } = useSocket();
  const { subscribedWatchlist, setSubscribedWatchlist } = useMarketStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  // Room subscription logic on watchlist change
  useEffect(() => {
    const newId = selectedWatchlist?._id || null;

    if (subscribedWatchlist && subscribedWatchlist !== newId) {
      leaveWatchlist(subscribedWatchlist);
      setSubscribedWatchlist(null);
    }

    if (newId && subscribedWatchlist !== newId) {
      joinWatchlist(newId);
      setSubscribedWatchlist(newId);
    }
  }, [selectedWatchlist, subscribedWatchlist, joinWatchlist, leaveWatchlist, setSubscribedWatchlist]);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedWatchlist) return;
    if (window.confirm(`Are you sure you want to delete the folder "${selectedWatchlist.name}"?`)) {
      await deleteWatchlist(selectedWatchlist._id);
      // Fallback selection to the first available watchlist if any
      const remaining = watchlists.filter(w => w._id !== selectedWatchlist._id);
      if (remaining.length > 0) {
        setSelectedWatchlist(remaining[0]);
      } else {
        setSelectedWatchlist(null);
      }
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 p-6 flex items-center justify-between shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-[#0f172a] tracking-tight">
          Watchlist
        </h2>
        
        {loading ? (
          <span className="text-gray-400 text-sm font-medium">Loading...</span>
        ) : error ? (
          <span className="text-danger text-sm font-medium">{error}</span>
        ) : (
          <div className="relative flex items-center bg-surface-low border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus-within:border-brand transition-colors">
            <Folder className="w-4 h-4 text-brand mr-2 shrink-0" />
            <select
              value={selectedWatchlist?._id || ""}
              onChange={(e) => {
                const wl = watchlists.find((w) => w._id === e.target.value);
                if (wl) setSelectedWatchlist(wl);
              }}
              className="bg-transparent text-sm font-bold text-brand outline-none cursor-pointer appearance-none w-full min-w-[120px]"
            >
              {watchlists.length === 0 && <option value="" disabled>No Folders Found</option>}
              {watchlists.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} ({w.stocks.length})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
        
        {selectedWatchlist && !loading && (
          <button 
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors cursor-pointer"
            title="Delete Folder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        onClick={handleCreate}
        className="rounded-lg bg-brand text-white px-4 py-2 text-sm font-bold hover:opacity-90 transition cursor-pointer shadow-sm flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span>
        <span className="hidden sm:inline">New Folder</span>
      </button>

      <CreateWatchlistModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default WatchlistHeader;
