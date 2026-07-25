import mongoose from "mongoose";
import Portfolio from "../../../models/Portfolio.js";
import { getCurrentPrice } from "../../marketPriceCache.js";

/**
 * Retrieves clean, structured portfolio context for a given user.
 * Strips all internal database identifiers (_id, __v, user, etc.).
 * 
 * @param {string} userId
 * @returns {Promise<Object>} Clean portfolio object { cash, totalValue, investedValue, totalPnL, roi, holdings }
 */
export const getPortfolioContext = async (userId) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected || !userId) {
    return {
      cash: 1000000,
      totalValue: 1000000,
      investedValue: 0,
      totalPnL: 0,
      roi: 0,
      holdingCount: 0,
      holdings: [],
    };
  }

  const portfolioDoc = await Portfolio.findOne({ user: userId }).maxTimeMS(2000).lean();

  if (!portfolioDoc) {
    return {
      cash: 1000000,
      totalValue: 1000000,
      investedValue: 0,
      totalPnL: 0,
      roi: 0,
      holdingCount: 0,
      holdings: [],
    };
  }

  let holdingsValue = 0;
  let investedValue = 0;

  const holdings = (portfolioDoc.holdings || []).map((h) => {
    const live = getCurrentPrice(h.symbol);
    const currentPrice = live?.price || h.averagePrice;
    const value = currentPrice * h.quantity;
    const invested = h.averagePrice * h.quantity;
    const pnl = value - invested;
    const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0;

    holdingsValue += value;
    investedValue += invested;

    return {
      symbol: h.symbol,
      companyName: h.companyName || h.symbol,
      sector: h.sector || "Unknown",
      industry: h.industry || "Unknown",
      quantity: h.quantity,
      averagePrice: h.averagePrice,
      currentPrice: currentPrice,
      value: Number(value.toFixed(2)),
      investedValue: Number(invested.toFixed(2)),
      pnl: Number(pnl.toFixed(2)),
      pnlPercentage: Number(pnlPercentage.toFixed(2)),
    };
  });

  const cash = portfolioDoc.cash || 0;
  const totalValue = cash + holdingsValue;
  const totalPnL = holdingsValue - investedValue;
  const roi = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;

  return {
    cash: Number(cash.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    investedValue: Number(investedValue.toFixed(2)),
    totalPnL: Number(totalPnL.toFixed(2)),
    roi: Number(roi.toFixed(2)),
    holdingCount: holdings.length,
    holdings,
  };
};

export default {
  getPortfolioContext,
};
