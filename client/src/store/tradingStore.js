import { create } from "zustand";

const useTradingStore = create((set) => ({
  selectedStock: null,
  isTradeModalOpen: false,
  tradeType: "BUY", // "BUY" or "SELL"
  loading: false,
  error: null,

  selectStock: (stock) =>
    set({
      selectedStock: stock,
      error: null,
    }),

  openBuy: () =>
    set({
      tradeType: "BUY",
      isTradeModalOpen: true,
    }),

  openSell: () =>
    set({
      tradeType: "SELL",
      isTradeModalOpen: true,
    }),

  closeModal: () =>
    set({
      isTradeModalOpen: false,
    }),

  setError: (error) =>
    set({
      error,
    }),

  reset: () =>
    set({
      selectedStock: null,
      isTradeModalOpen: false,
      tradeType: "BUY",
      loading: false,
      error: null,
    }),
}));

export default useTradingStore;
