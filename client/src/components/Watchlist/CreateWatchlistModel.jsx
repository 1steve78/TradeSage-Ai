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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="w-96 rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl text-white">
        <h2 className="mb-5 text-lg font-semibold text-white tracking-wide">
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
            className="mb-4 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 transition-colors"
          />

          {error && (
            <p className="mb-4 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 text-sm">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-400 text-slate-950 font-semibold px-4 py-2 hover:bg-cyan-300 transition disabled:opacity-50 cursor-pointer shadow-sm shadow-cyan-400/20"
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