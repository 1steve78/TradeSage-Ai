import { create } from "zustand";

const useMarketStore = create((set) => ({
  prices: {},

  connected: false,

  marketStatus: "OPEN",

  lastUpdated: null,

  subscribedWatchlist: null,

  setSubscribedWatchlist: (id) =>
    set({
      subscribedWatchlist: id,
    }),

  connect: () =>
    set({
      connected: true,
    }),

  disconnect: () =>
    set({
      connected: false,
    }),

  updateManyPrices: (prices) =>
    set((state) => {
      const updated = {
        ...state.prices,
      };

      prices.forEach((stock) => {
        const previous = state.prices[stock.symbol];

        updated[stock.symbol] = {
          ...stock,
          previousPrice: previous?.price ?? stock.price,
        };
      });

      return {
        prices: updated,
        lastUpdated: Date.now(),
      };
    }),

  updatePrice: (price) =>
    set((state) => {
      const previous = state.prices[price.symbol];
      return {
        prices: {
          ...state.prices,
          [price.symbol]: {
            ...price,
            previousPrice: previous?.price ?? price.price,
          },
        },
        lastUpdated: Date.now(),
      };
    }),
}));

export default useMarketStore;