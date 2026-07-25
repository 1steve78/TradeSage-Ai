import mongoose from "mongoose";
import Portfolio from "../../models/Portfolio.js";
import Transaction from "../../models/Transaction.js";
import Watchlist from "../../models/Watchlist.js";
import User from "../../models/User.js";
import {
  calculatePortfolioSummary,
  calculateAllocation,
  calculateSectorDistribution,
  calculatePerformance,
} from "../analytics/analyticsService.js";
import { getCurrentPrice } from "../marketPriceCache.js";

/**
 * Builds structured portfolio context object for a given user.
 * Returns only structured JSON - no text prompts or direct database objects.
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Structured context containing portfolio, analytics, holdings, transactions, watchlists, risk
 */
export const buildPortfolioContext = async (userId) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected || !userId) {
      return {
        portfolio: null,
        holdings: [],
        analytics: null,
        transactions: [],
        watchlists: [],
        risk: { riskProfile: "Medium" },
      };
    }

    // 1. Fetch User details for Risk Profile
    const userDoc = await User.findById(userId).select("riskProfile name email").lean();
    const riskProfile = userDoc?.riskProfile || "Medium";

    // 2. Fetch Portfolio & Holdings
    const portfolioDoc = await Portfolio.findOne({ user: userId }).lean();
    let portfolioData = null;
    let holdingsData = [];

    if (portfolioDoc) {
      let currentHoldingsTotalValue = 0;
      let totalInvested = 0;

      holdingsData = (portfolioDoc.holdings || []).map((h) => {
        const live = getCurrentPrice(h.symbol);
        const currentPrice = live?.price || h.averagePrice;
        const currentValue = currentPrice * h.quantity;
        const investedValue = h.averagePrice * h.quantity;
        const unrealizedPnL = currentValue - investedValue;
        const returnPercentage = investedValue > 0 ? (unrealizedPnL / investedValue) * 100 : 0;

        currentHoldingsTotalValue += currentValue;
        totalInvested += investedValue;

        return {
          symbol: h.symbol,
          companyName: h.companyName || h.symbol,
          sector: h.sector || "Unknown",
          industry: h.industry || "Unknown",
          quantity: h.quantity,
          averagePrice: h.averagePrice,
          currentPrice: currentPrice,
          currentValue: Number(currentValue.toFixed(2)),
          investedValue: Number(investedValue.toFixed(2)),
          unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
          returnPercentage: Number(returnPercentage.toFixed(2)),
        };
      });

      const totalPortfolioValue = (portfolioDoc.cash || 0) + currentHoldingsTotalValue;
      const overallPnL = currentHoldingsTotalValue - totalInvested;
      const roi = totalInvested > 0 ? (overallPnL / totalInvested) * 100 : 0;

      portfolioData = {
        cash: portfolioDoc.cash || 0,
        investedValue: Number(totalInvested.toFixed(2)),
        holdingsValue: Number(currentHoldingsTotalValue.toFixed(2)),
        totalValue: Number(totalPortfolioValue.toFixed(2)),
        totalPnL: Number(overallPnL.toFixed(2)),
        roi: Number(roi.toFixed(2)),
        holdingCount: holdingsData.length,
      };
    } else {
      portfolioData = {
        cash: 1000000,
        investedValue: 0,
        holdingsValue: 0,
        totalValue: 1000000,
        totalPnL: 0,
        roi: 0,
        holdingCount: 0,
      };
    }

    // 3. Fetch Analytics & Performance
    const [summary, allocationRes, sectorRes, perfRes] = await Promise.all([
      calculatePortfolioSummary(userId).catch(() => null),
      calculateAllocation(userId).catch(() => ({ allocation: [] })),
      calculateSectorDistribution(userId).catch(() => ({ distribution: [] })),
      calculatePerformance(userId).catch(() => ({ bestPerformer: {}, worstPerformer: {}, statistics: {} })),
    ]);

    const analyticsData = {
      summary: summary || portfolioData,
      allocations: allocationRes?.allocation || [],
      sectorDistribution: sectorRes?.distribution || [],
      bestPerformer: perfRes?.bestPerformer || {},
      worstPerformer: perfRes?.worstPerformer || {},
      tradingStats: perfRes?.statistics || {},
    };

    // 4. Fetch Recent Transactions (last 15)
    const recentTxDocs = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const transactionsData = recentTxDocs.map((tx) => ({
      symbol: tx.symbol,
      companyName: tx.companyName,
      type: tx.type,
      quantity: tx.quantity,
      price: tx.price,
      totalAmount: tx.totalAmount,
      status: tx.status,
      date: tx.createdAt ? new Date(tx.createdAt).toISOString().split("T")[0] : null,
    }));

    // 5. Fetch Watchlists
    const watchlistDocs = await Watchlist.find({ userId }).lean();
    const watchlistsData = watchlistDocs.map((w) => ({
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

    return {
      portfolio: portfolioData,
      holdings: holdingsData,
      analytics: analyticsData,
      transactions: transactionsData,
      watchlists: watchlistsData,
      risk: {
        riskProfile,
      },
    };
  } catch (error) {
    console.error("Error in buildPortfolioContext:", error);
    throw error;
  }
};

export default {
  buildPortfolioContext,
};
