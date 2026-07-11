import { create } from "zustand";

import {
  getWatchlists,
  createWatchlist as createWatchlistApi,
  renameWatchlist as renameWatchlistApi,
  deleteWatchlist as deleteWatchlistApi,
  addStock as addStockApi,
  removeStock as removeStockApi,
} from "../services/watchlistApi";

const useWatchlistStore = create((set, get) => ({
  // ==========================
  // State
  // ==========================

  watchlists: [],

  selectedWatchlist: null,

  loading: false,

  error: null,

  // ==========================
  // Actions
  // ==========================

  fetchWatchlists: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const watchlists = await getWatchlists();

      set({
        watchlists,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
    }
  },

  createWatchlist: async (name) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const newWatchlist =
        await createWatchlistApi(name);

      set((state) => ({
        watchlists: [
          ...state.watchlists,
          newWatchlist,
        ],
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
    }
  },

  renameWatchlist: async (id, name) => {
    try {
      const updated =
        await renameWatchlistApi(id, name);

      set((state) => ({
        watchlists: state.watchlists.map((watchlist) =>
          watchlist._id === id
            ? updated
            : watchlist
        ),
      }));
    } catch (error) {
      set({
        error: error.message,
      });
    }
  },

  deleteWatchlist: async (id) => {
    try {
      await deleteWatchlistApi(id);

      set((state) => ({
        watchlists: state.watchlists.filter(
          (watchlist) => watchlist._id !== id
        ),

        selectedWatchlist:
          state.selectedWatchlist?._id === id
            ? null
            : state.selectedWatchlist,
      }));
    } catch (error) {
      set({
        error: error.message,
      });
    }
  },

  addStock: async (watchlistId, stock) => {
    try {
      const updated =
        await addStockApi(
          watchlistId,
          stock
        );

      set((state) => ({
        watchlists: state.watchlists.map((watchlist) =>
          watchlist._id === watchlistId
            ? updated
            : watchlist
        ),

        selectedWatchlist:
          state.selectedWatchlist?._id ===
          watchlistId
            ? updated
            : state.selectedWatchlist,
      }));
    } catch (error) {
      set({
        error: error.message,
      });
    }
  },

  removeStock: async (watchlistId, symbol) => {
    try {
      const updated =
        await removeStockApi(
          watchlistId,
          symbol
        );

      set((state) => ({
        watchlists: state.watchlists.map((watchlist) =>
          watchlist._id === watchlistId
            ? updated
            : watchlist
        ),

        selectedWatchlist:
          state.selectedWatchlist?._id ===
          watchlistId
            ? updated
            : state.selectedWatchlist,
      }));
    } catch (error) {
      set({
        error: error.message,
      });
    }
  },

  setSelectedWatchlist: (watchlist) =>
    set({
      selectedWatchlist: watchlist,
    }),

  clearError: () =>
    set({
      error: null,
    }),
}));

export default useWatchlistStore;