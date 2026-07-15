import { useState, useEffect } from "react";
import useWatchlistStore from "../../store/watchlistStore";
import useMarketStore from "../../store/marketStore";
import { useSocket } from "../../context/SocketContext";
import CreateWatchlistModal from "./CreateWatchlistModel";
import WatchlistItem from "./WatchlistItem";

const WatchlistSidebar = () => {
  const {
    watchlists,
    selectedWatchlist,
    loading,
    error,
    fetchWatchlists,
    setSelectedWatchlist,
  } = useWatchlistStore();

  const { joinWatchlist, leaveWatchlist } = useSocket();
  const { subscribedWatchlist, setSubscribedWatchlist } = useMarketStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  // Room subscription logic on watchlist change
  useEffect(() => {
    const newId = selectedWatchlist?._id || null;

    if (subscribedWatchlist && subscribedWatchlist !== newId) {
      console.log(`Leaving watchlist room: ${subscribedWatchlist}`);
      leaveWatchlist(subscribedWatchlist);
      setSubscribedWatchlist(null);
    }

    if (newId && subscribedWatchlist !== newId) {
      console.log(`Joining watchlist room: ${newId}`);
      joinWatchlist(newId);
      setSubscribedWatchlist(newId);
    }
  }, [selectedWatchlist, subscribedWatchlist, joinWatchlist, leaveWatchlist, setSubscribedWatchlist]);

  // ADDED: The missing handler to open the modal
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  return (
    <aside className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          Watchlists
        </h2>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-cyan-400 text-slate-950 px-3 py-1 text-sm font-semibold hover:bg-cyan-300 transition cursor-pointer shadow-sm shadow-cyan-400/25"
        >
          + Create
        </button>
      </div>

      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {!loading && watchlists.length === 0 && (
        <p className="text-gray-500">No watchlists yet.</p>
      )}

      <div className="space-y-2">
        {watchlists.map((watchlist) => (
          <WatchlistItem
            key={watchlist._id}
            watchlist={watchlist}
            selected={selectedWatchlist?._id === watchlist._id}
            onSelect={setSelectedWatchlist}
          />
        ))}
      </div>

      <CreateWatchlistModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
};

export default WatchlistSidebar;