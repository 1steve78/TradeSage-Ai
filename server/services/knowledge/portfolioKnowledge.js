/**
 * portfolioKnowledge.js
 *
 * Gathers user portfolio holdings, analytics metrics, transaction history,
 * and risk/health scores into a unified structured Knowledge Object.
 */

import Portfolio from "../../models/Portfolio.js";
import Transaction from "../../models/Transaction.js";
import { calculateHealthScore } from "../ai/healthScoreService.js";
import { analyzePortfolioRules } from "../ai/ruleEngineService.js";

/**
 * Generates unified Portfolio Knowledge Object for a given user.
 *
 * @param {string} userId - Mongoose user ID
 * @returns {Promise<object>} Structured portfolio knowledge JSON
 */
export async function getPortfolioKnowledge(userId) {
  if (!userId) {
    return {
      userId: null,
      portfolio: null,
      analytics: null,
      risk: { healthScore: 75, status: "Healthy", alerts: [] },
      transactions: [],
      generatedAt: new Date().toISOString(),
    };
  }

  // 1. Fetch User Portfolio
  const portfolioDoc = await Portfolio.findOne({ user: userId }).lean();
  const portfolio = portfolioDoc || {
    cash: 1000000,
    holdings: [],
    investedValue: 0,
    totalValue: 1000000,
    totalPnL: 0,
  };

  // 2. Fetch Recent Transactions
  let transactions = [];
  try {
    transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  } catch (err) {
    transactions = [];
  }

  // 3. Compute Risk & Health Scores using deterministic rule engine
  let healthInfo = { totalScore: 75, status: "Healthy", breakdowns: {} };
  let riskAnalysis = { healthScore: 75, warnings: [], insights: [] };
  try {
    healthInfo = calculateHealthScore(portfolio);
    riskAnalysis = analyzePortfolioRules({ portfolio });
  } catch (err) {
    console.warn("[portfolioKnowledge] Risk calculation warning:", err.message);
  }

  // 4. Synthesize Portfolio Knowledge Object
  return {
    userId,
    portfolio: {
      cash: portfolio.cash,
      holdingsCount: portfolio.holdings?.length || 0,
      holdings: portfolio.holdings || [],
      investedValue: portfolio.investedValue || 0,
      totalValue: portfolio.totalValue || 1000000,
      totalPnL: portfolio.totalPnL || 0,
    },
    analytics: {
      diversificationScore: healthInfo.breakdowns?.diversification || 70,
      volatilityScore: healthInfo.breakdowns?.volatility || 80,
    },
    risk: {
      healthScore: healthInfo.totalScore || riskAnalysis.healthScore,
      status: healthInfo.status,
      alertsCount: riskAnalysis.warnings?.length || 0,
      alerts: riskAnalysis.warnings || [],
    },
    recentTransactions: transactions.map((t) => ({
      symbol: t.symbol,
      type: t.type,
      quantity: t.quantity,
      price: t.price,
      date: t.createdAt,
    })),
    generatedAt: new Date().toISOString(),
  };
}

export default { getPortfolioKnowledge };
