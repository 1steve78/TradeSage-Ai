/**
 * Prompt Service: Formats context objects into structured prompts for NVIDIA NIM LLM.
 */

/**
 * Formats context into a Market Summary prompt
 * @param {Object} context
 * @returns {string} Formatted prompt string
 */
export const marketSummaryPrompt = (context = {}) => {
  const { portfolio, watchlist, market, news } = context;

  return `You are TradeSage AI, an elite financial market analyst. Analyze the structured market & user context below:

PORTFOLIO OVERVIEW:
${portfolio ? JSON.stringify(portfolio, null, 2) : "No active holdings."}

WATCHLIST:
${watchlist ? JSON.stringify(watchlist, null, 2) : "No active watchlist items."}

MARKET MOVERS & INDEXES:
${market ? JSON.stringify(market, null, 2) : "No market data available."}

RELEVANT NEWS HEADLINES:
${news ? JSON.stringify(news, null, 2) : "No recent news."}

INSTRUCTIONS:
1. Provide a concise "Market Pulse" summary focusing on how today's news and market movements directly impact the user's portfolio and watchlist.
2. Structure your response into clear bullet points with concise key insights.
3. Highlight key risk factors or tactical opportunities.`;
};

/**
 * Formats context into a Portfolio Summary prompt
 * @param {Object} context
 * @returns {string} Formatted prompt string
 */
export const portfolioSummaryPrompt = (context = {}) => {
  const { portfolio, analytics } = context;

  return `You are TradeSage AI. Analyze the user's portfolio performance and allocation metrics below:

PORTFOLIO HOLDINGS:
${portfolio ? JSON.stringify(portfolio, null, 2) : "N/A"}

ANALYTICS & METRICS:
${analytics ? JSON.stringify(analytics, null, 2) : "N/A"}

INSTRUCTIONS:
1. Provide a overall portfolio health assessment.
2. Identify top performers, drag on performance, and asset concentration risks.
3. Provide 2-3 actionable rebalancing recommendations.`;
};

/**
 * Formats context into a Risk Assessment prompt
 * @param {Object} context
 * @returns {string} Formatted prompt string
 */
export const riskPrompt = (context = {}) => {
  const { portfolio, analytics, market } = context;

  return `You are TradeSage AI Risk Management Engine.

PORTFOLIO:
${portfolio ? JSON.stringify(portfolio, null, 2) : "N/A"}

METRICS:
${analytics ? JSON.stringify(analytics, null, 2) : "N/A"}

MARKET CONDITIONS:
${market ? JSON.stringify(market, null, 2) : "N/A"}

INSTRUCTIONS:
1. Evaluate concentration risk, sector risk, and drawdown vulnerability.
2. Outline specific risk exposure alerts.
3. Suggest risk mitigation or hedging strategies.`;
};

/**
 * Formats context into a News Analysis prompt
 * @param {Object} context
 * @returns {string} Formatted prompt string
 */
export const newsPrompt = (context = {}) => {
  const { news, symbol, watchlist } = context;

  return `You are TradeSage AI Sentiment & News Specialist.

TARGET SYMBOL / WATCHLIST:
${symbol ? `Symbol: ${symbol}` : `Watchlist: ${JSON.stringify(watchlist || [], null, 2)}`}

NEWS HEADLINES:
${news ? JSON.stringify(news, null, 2) : "N/A"}

INSTRUCTIONS:
1. Categorize news sentiment (Bullish, Bearish, or Neutral).
2. Explain potential market or price impact.
3. Highlight critical catalysts to monitor.`;
};

export default {
  marketSummaryPrompt,
  portfolioSummaryPrompt,
  riskPrompt,
  newsPrompt,
};
