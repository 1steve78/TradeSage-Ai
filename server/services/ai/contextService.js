import crypto from "crypto";
import mongoose from "mongoose";
import Portfolio from "../../models/Portfolio.js";
import Watchlist from "../../models/Watchlist.js";
import {
  calculatePortfolioSummary,
  calculateAllocation,
  calculateSectorDistribution,
} from "../analytics/analyticsService.js";
import { getCurrentPrice } from "../marketPriceCache.js";

/**
 * Hash object deterministically using SHA256 / MD5
 * @param {Object} data
 * @returns {string} Hash string
 */
export const generateContextHash = (data) => {
  const jsonString = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash("sha256").update(jsonString).digest("hex");
};

/**
 * Builds aggregated Market Context for a user (Portfolio + Analytics + Watchlist + Market + News)
 * @param {string} userId
 * @returns {Promise<Object>} Aggregated context object
 */
export const buildMarketContext = async (userId) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    // 1. Fetch Portfolio
    let portfolio = null;
    if (isDbConnected && userId) {
      const portfolioDoc = await Portfolio.findOne({ user: userId }).maxTimeMS(2000);
      if (portfolioDoc) {
        portfolio = {
          cash: portfolioDoc.cash,
          totalValue: portfolioDoc.totalValue,
          investedValue: portfolioDoc.investedValue,
          totalPnL: portfolioDoc.totalPnL,
          holdings: portfolioDoc.holdings.map((h) => ({
            symbol: h.symbol,
            companyName: h.companyName,
            quantity: h.quantity,
            averagePrice: h.averagePrice,
            currentPrice: getCurrentPrice(h.symbol)?.price || h.averagePrice,
          })),
        };
      }
    }

    // 2. Fetch Analytics
    let analytics = null;
    if (isDbConnected && userId) {
      const summary = await calculatePortfolioSummary(userId);
      const allocation = await calculateAllocation(userId);
      const sectors = await calculateSectorDistribution(userId);
      analytics = {
        summary,
        topAllocations: allocation.allocation?.slice(0, 5) || [],
        sectorDistribution: sectors.distribution || [],
      };
    }

    // 3. Fetch Watchlist
    let watchlistData = [];
    if (isDbConnected && userId) {
      const watchlists = await Watchlist.find({ userId }).maxTimeMS(2000);
      const watchlistSymbols = [
        ...new Set(watchlists.flatMap((w) => w.stocks.map((s) => s.symbol))),
      ];
      watchlistData = watchlistSymbols.map((sym) => {
        const live = getCurrentPrice(sym);
        return {
          symbol: sym,
          price: live?.price || "N/A",
          changePercent: live?.changePercent || 0,
        };
      });
    }

    // 4. Market Movers & Major Indices
    const marketSymbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"];
    const marketMovers = marketSymbols.map((sym) => {
      const live = getCurrentPrice(sym);
      return {
        symbol: sym,
        price: live?.price || "N/A",
        changePercent: live?.changePercent || 0,
      };
    });

    // 5. Relevant Market News / Headlines
    const news = [
      {
        title: "RBI keeps repo rates unchanged; projects steady GDP growth",
        source: "Financial Express",
        sentiment: "Bullish",
      },
      {
        title: "IT sector sees positive momentum driven by strong Q1 order books",
        source: "Economic Times",
        sentiment: "Bullish",
      },
      {
        title: "Global inflation concerns trigger minor volatility in energy stocks",
        source: "Mint",
        sentiment: "Neutral",
      },
    ];

    const context = {
      timestamp: new Date().toISOString().split("T")[0],
      portfolio,
      analytics,
      watchlist: watchlistData,
      market: marketMovers,
      news,
    };

    const contextHash = generateContextHash(context);

    return {
      context,
      contextHash,
    };
  } catch (error) {
    console.error("Error building market context:", error);
    throw error;
  }
};

export default {
  buildMarketContext,
  generateContextHash,
};
