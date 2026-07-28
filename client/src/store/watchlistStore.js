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

  // Single-source-of-truth helper: check if stock is in any/selected watchlist
  isStockInWatchlist: (symbol) => {
    if (!symbol) return false;
    const { watchlists } = get();
    const cleanSym = symbol.toUpperCase();
    return watchlists.some((w) =>
      w.stocks?.some((s) => s.symbol.toUpperCase() === cleanSym)
    );
  },

  // Optimistic UI toggle for instant header/search feedback
  toggleStockInWatchlist: async (stock) => {
    const { watchlists, selectedWatchlist, addStock, removeStock, isStockInWatchlist } = get();
    const symbol = typeof stock === "string" ? stock : stock.symbol;
    const companyName = typeof stock === "string" ? stock : (stock.companyName || stock.name || symbol);

    // Target watchlist (selected or first available)
    let targetW = selectedWatchlist || watchlists[0];

    // If no watchlist exists yet, create default
    if (!targetW) {
      try {
        targetW = await createWatchlistApi("My Watchlist");
        set((state) => ({
          watchlists: [...state.watchlists, targetW],
          selectedWatchlist: targetW,
        }));
      } catch (err) {
        console.error("Failed to create default watchlist", err);
        return;
      }
    }

    const isIn = isStockInWatchlist(symbol);
    const prevWatchlists = [...get().watchlists];
    const prevSelected = get().selectedWatchlist;

    // 1. OPTIMISTIC UPDATE
    if (isIn) {
      // Optimistically remove
      set((state) => {
        const nextWatchlists = state.watchlists.map((w) => ({
          ...w,
          stocks: w.stocks.filter((s) => s.symbol.toUpperCase() !== symbol.toUpperCase()),
        }));
        return {
          watchlists: nextWatchlists,
          selectedWatchlist: nextWatchlists.find((w) => w._id === state.selectedWatchlist?._id) || nextWatchlists[0] || null,
        };
      });

      // 2. BACKEND API CALL
      try {
        await removeStockApi(targetW._id, symbol);
      } catch (err) {
        // Rollback on failure
        set({ watchlists: prevWatchlists, selectedWatchlist: prevSelected, error: err.message });
      }
    } else {
      // Optimistically add
      set((state) => {
        const nextWatchlists = state.watchlists.map((w) => {
          if (w._id === targetW._id) {
            const alreadyHas = w.stocks.some((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
            return alreadyHas ? w : { ...w, stocks: [...w.stocks, { symbol, companyName }] };
          }
          return w;
        });
        return {
          watchlists: nextWatchlists,
          selectedWatchlist: nextWatchlists.find((w) => w._id === state.selectedWatchlist?._id) || nextWatchlists[0] || null,
        };
      });

      // 2. BACKEND API CALL
      try {
        await addStockApi(targetW._id, { symbol, companyName });
      } catch (err) {
        // Rollback on failure
        set({ watchlists: prevWatchlists, selectedWatchlist: prevSelected, error: err.message });
      }
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