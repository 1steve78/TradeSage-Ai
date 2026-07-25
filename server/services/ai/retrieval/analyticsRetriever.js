import {
  calculatePortfolioSummary,
  calculateAllocation,
  calculateSectorDistribution,
  calculatePerformance,
} from "../../analytics/analyticsService.js";

/**
 * Retrieves analytics metrics (ROI, allocations, sectors, best/worst performers, trade stats).
 * Reuses existing analyticsService functions.
 * 
 * @param {string} userId
 * @returns {Promise<Object>} Analytics context object
 */
export const getAnalyticsContext = async (userId) => {
  if (!userId) {
    return {
      portfolioValue: 0,
      roi: 0,
      allocation: [],
      sectors: [],
      bestPerformer: {},
      worstPerformer: {},
      tradingStats: {},
    };
  }

  const [summary, allocationRes, sectorRes, perfRes] = await Promise.all([
    calculatePortfolioSummary(userId).catch(() => null),
    calculateAllocation(userId).catch(() => ({ allocation: [] })),
    calculateSectorDistribution(userId).catch(() => ({ distribution: [] })),
    calculatePerformance(userId).catch(() => ({ bestPerformer: {}, worstPerformer: {}, statistics: {} })),
  ]);

  return {
    portfolioValue: summary?.portfolioValue || 0,
    roi: summary?.roi || 0,
    allocation: allocationRes?.allocation || [],
    sectors: sectorRes?.distribution || [],
    bestPerformer: perfRes?.bestPerformer || {},
    worstPerformer: perfRes?.worstPerformer || {},
    tradingStats: perfRes?.statistics || {},
  };
};

export default {
  getAnalyticsContext,
};
