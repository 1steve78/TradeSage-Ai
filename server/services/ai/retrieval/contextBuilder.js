/**
 * Constructs an optimized, minimal context object containing ONLY the financial 
 * categories requested by the question classifier.
 * 
 * @param {Array<string>} categories - Active category flags (PORTFOLIO, PERFORMANCE, SECTOR, TRANSACTIONS, WATCHLIST, RISK)
 * @param {Object} retrievedData - Map of data objects returned by invoked retrievers
 * @returns {Object} Clean, focused context object for LLM prompt
 */
export const buildOptimizedContext = (categories = [], retrievedData = {}) => {
  const context = {
    timestamp: new Date().toISOString().split("T")[0],
    retrievedCategories: categories,
  };

  const categorySet = new Set(categories);

  // 1. Portfolio Context
  if (categorySet.has("PORTFOLIO") && retrievedData.portfolio) {
    context.portfolio = {
      cash: retrievedData.portfolio.cash,
      totalValue: retrievedData.portfolio.totalValue,
      investedValue: retrievedData.portfolio.investedValue,
      totalPnL: retrievedData.portfolio.totalPnL,
      roi: retrievedData.portfolio.roi,
      holdingCount: retrievedData.portfolio.holdingCount,
      holdings: retrievedData.portfolio.holdings || [],
    };
  }

  // 2. Performance & Analytics Context
  if (categorySet.has("PERFORMANCE") && retrievedData.analytics) {
    context.analytics = {
      roi: retrievedData.analytics.roi,
      bestPerformer: retrievedData.analytics.bestPerformer,
      worstPerformer: retrievedData.analytics.worstPerformer,
      tradingStats: retrievedData.analytics.tradingStats,
    };
  }

  // 3. Sector Distribution Context
  if (categorySet.has("SECTOR") && retrievedData.analytics) {
    context.sectorDistribution = retrievedData.analytics.sectors || [];
    context.topAllocations = retrievedData.analytics.allocation || [];
  }

  // 4. Recent Transactions Context
  if (categorySet.has("TRANSACTIONS") && retrievedData.transactions) {
    context.recentTransactions = retrievedData.transactions.recentTransactions || [];
  }

  // 5. Watchlist Context
  if (categorySet.has("WATCHLIST") && retrievedData.watchlists) {
    context.watchlists = retrievedData.watchlists.watchlists || [];
  }

  // 6. Risk Profile Context
  if (categorySet.has("RISK") && retrievedData.risk) {
    context.riskProfile = retrievedData.risk.riskProfile;
  }

  return context;
};

export default {
  buildOptimizedContext,
};
