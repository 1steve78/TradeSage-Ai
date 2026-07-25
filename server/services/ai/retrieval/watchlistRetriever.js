import mongoose from "mongoose";
import Watchlist from "../../../models/Watchlist.js";
import { getCurrentPrice } from "../../marketPriceCache.js";

/**
 * Retrieves user watchlists with live price feeds.
 * 
 * @param {string} userId
 * @returns {Promise<Object>} { watchlists }
 */
export const getWatchlistContext = async (userId) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected || !userId) {
    return { watchlists: [] };
  }

  const watchlistDocs = await Watchlist.find({ userId }).maxTimeMS(2000).lean();

  const watchlists = watchlistDocs.map((w) => ({
    name: w.name,
    stocks: (w.stocks || []).map((s) => {
      const live = getCurrentPrice(s.symbol);
      return {
        symbol: s.symbol,
        companyName: s.companyName,
        price: live?.price || "N/A",
        changePercent: live?.changePercent || 0,
      };
    }),
  }));

  return { watchlists };
};

export default {
  getWatchlistContext,
};
