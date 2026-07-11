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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-96 rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-5 text-xl font-bold">
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
            className="mb-4 w-full rounded-lg border p-3 outline-none"
          />

          {error && (
            <p className="mb-4 text-red-500">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
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