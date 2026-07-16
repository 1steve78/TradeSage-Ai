import { create } from "zustand";
import {
  buyStock as buyStockApi,
  sellStock as sellStockApi,
  getPortfolio,
  getTransactions
} from "../services/tradingApi";

const usePortfolioStore = create((set, get) => ({
  portfolio: null,
  transactions: [],
  loading: false,
  error: null,

  fetchPortfolio: async () => {
    try {
      set({ loading: true, error: null });
      const portfolio = await getPortfolio();
      set({ portfolio, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const transactions = await getTransactions();
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  buyStock: async (symbol, companyName, quantity) => {
    try {
      set({ loading: true, error: null });
      const updatedPortfolio = await buyStockApi(symbol, companyName, quantity);
      set({ portfolio: updatedPortfolio, loading: false });
      // Refetch transactions after trading
      await get().fetchTransactions();
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  sellStock: async (symbol, companyName, quantity) => {
    try {
      set({ loading: true, error: null });
      const updatedPortfolio = await sellStockApi(symbol, companyName, quantity);
      set({ portfolio: updatedPortfolio, loading: false });
      // Refetch transactions after trading
      await get().fetchTransactions();
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  reset: () => set({
    portfolio: null,
    transactions: [],
    loading: false,
    error: null
  })
}));

export default usePortfolioStore;