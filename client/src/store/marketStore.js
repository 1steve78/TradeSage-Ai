import { create } from "zustand";

const useMarketStore = create((set) => ({
  prices: {},

  connected: false,

  marketStatus: "OPEN",

  lastUpdated: null,

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
        ...state.prices,le
        };

        prices.forEach((stock) => {
        const previous =
            state.prices[stock.symbol];

        updated[stock.symbol] = {
            ...stock,
            previousPrice:
            previous?.price ?? stock.price,
        };
    });

    return {
      prices: updated,
      lastUpdated: Date.now(),
    };
  }),

  updatePrice: (price) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [price.symbol]: price,
      },
      lastUpdated: Date.now(),
    })),
}));

export default useMarketStore;