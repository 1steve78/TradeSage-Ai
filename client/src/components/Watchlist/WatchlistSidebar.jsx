import { useState, useEffect } from "react";
import useWatchlistStore from "../../store/watchlistStore";
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  // ADDED: The missing handler to open the modal
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  return (
    <aside className="w-72 border-r h-screen p-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">
          Watchlists
        </h2>

        <button
          onClick={handleCreate}
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 transition"
        >
          +
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