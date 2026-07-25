/**
 * Rule-based Intent and Category Question Classifier for TradeSage AI.
 * 
 * Intents:
 * - "cash": Questions about available cash, liquidity, buying power
 * - "performance": Questions about best/worst performers, ROI, profit, loss, PnL
 * - "sector": Questions about sector allocation, industry breakdown, diversification
 * - "risk": Questions about risk profile, volatility, portfolio health, concentration
 * - "transaction": Questions about buy/sell trades, recent transactions, history
 * - "watchlist": Questions about watchlist stocks, tracked symbols
 * - "summary": Overview of portfolio total value, holdings summary
 * - "general": Multi-faceted or conversational questions
 * 
 * @param {string} question
 * @returns {{ intent: string, categories: Array<string> }} Intent and category list
 */
export const classifyQuestion = (question = "") => {
  const text = question.toLowerCase().trim();
  const categories = new Set();
  let intent = "general";

  if (!text) {
    return {
      intent: "summary",
      categories: ["PORTFOLIO", "CONVERSATION"],
    };
  }

  // Keywords
  const cashKeywords = ["cash", "balance", "buying power", "liquidity", "available cash", "funds", "uninvested"];
  const performanceKeywords = ["best", "worst", "winner", "loser", "gain", "gainer", "loss", "profit", "pnl", "roi", "fall", "fell", "drop", "dropped", "rise", "rose", "up", "down", "perform", "performance", "hurt", "hurting", "return", "returns"];
  const sectorKeywords = ["sector", "industry", "diversification", "allocation", "breakdown", "exposure", "weight"];
  const transactionKeywords = ["buy", "bought", "sell", "sold", "trade", "traded", "transaction", "transactions", "yesterday", "recently", "history", "order", "purchase"];
  const watchlistKeywords = ["watchlist", "watchlists", "monitor", "track", "watching", "target"];
  const riskKeywords = ["risk", "volatility", "safe", "risky", "conservative", "aggressive", "danger", "health"];

  const matchesKeyword = (keywords) => keywords.some((kw) => text.includes(kw));

  if (matchesKeyword(cashKeywords)) {
    intent = "cash";
    categories.add("PORTFOLIO");
  } else if (matchesKeyword(performanceKeywords)) {
    intent = "performance";
    categories.add("PERFORMANCE");
    categories.add("PORTFOLIO");
  } else if (matchesKeyword(sectorKeywords)) {
    intent = "sector";
    categories.add("SECTOR");
    categories.add("PORTFOLIO");
  } else if (matchesKeyword(transactionKeywords)) {
    intent = "transaction";
    categories.add("TRANSACTIONS");
  } else if (matchesKeyword(watchlistKeywords)) {
    intent = "watchlist";
    categories.add("WATCHLIST");
  } else if (matchesKeyword(riskKeywords)) {
    intent = "risk";
    categories.add("RISK");
    categories.add("PORTFOLIO");
    categories.add("PERFORMANCE");
  } else {
    intent = "summary";
    categories.add("PORTFOLIO");
    categories.add("PERFORMANCE");
  }

  categories.add("CONVERSATION");

  return {
    intent,
    categories: Array.from(categories),
  };
};

export default {
  classifyQuestion,
};
