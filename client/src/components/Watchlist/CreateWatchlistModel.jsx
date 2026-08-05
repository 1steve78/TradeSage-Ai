import { useState } from "react";
import useWatchlistStore from "../../store/watchlistStore";

const CreateWatchlistModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  const {
    createWatchlist,
    loading,
    error,
    clearError,
  } = useWatchlistStore();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    await createWatchlist(name.trim());

    setName("");
    clearError();
    onClose();
  };

  const handleClose = () => {
    setName("");
    clearError();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand/40 backdrop-blur-sm">
      <div className="w-96 rounded-custom bg-white border border-gray-200 p-6 shadow-xl text-brand">
        <h2 className="mb-5 text-xl font-bold tracking-tight">
          Create Watchlist
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Watchlist name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="mb-4 w-full rounded-xl bg-surface border border-gray-200 p-3 text-brand font-medium placeholder-gray-400 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
          />

          {error && (
            <p className="mb-4 text-xs text-danger font-medium">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 text-sm font-bold">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 px-4 py-2 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand text-white px-4 py-2 hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading
                ? "Creating..."
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWatchlistModal;