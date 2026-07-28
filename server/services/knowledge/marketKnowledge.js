/**
 * marketKnowledge.js
 *
 * Gathers broad market indices, news headlines, sentiment heat scores,
 * and top movers into a structured Market Knowledge Object.
 */

import { getMarketNewsService } from "../news/newsService.js";
import { calculateMarketHeat } from "../news/sentimentService.js";
import { explainPriceMovement } from "../news/priceExplanationService.js";

/**
 * Generates unified Market Knowledge Object.
 *
 * @param {string} [category="general"] - Market news category
 * @returns {Promise<object>} Structured market knowledge JSON
 */
export async function getMarketKnowledge(category = "general") {
  // 1. Fetch Market Articles
  const articles = await getMarketNewsService(category);
  const heat = calculateMarketHeat(articles);

  // 2. Mock / Real Indices snapshot
  const indices = [
    { name: "NIFTY 50", price: "22,453.20", change: "-0.45%", status: "Bearish" },
    { name: "SENSEX", price: "74,119.55", change: "+0.12%", status: "Bullish" },
    { name: "BANK NIFTY", price: "48,210.80", change: "-0.88%", status: "Bearish" },
  ];

  // 3. Top Movers Explanations
  const featuredTickers = [
    { symbol: "RELIANCE", change: "+3.4%" },
    { symbol: "TCS", change: "-1.2%" },
    { symbol: "INFY", change: "+2.1%" },
  ];

  const topMovers = await Promise.all(
    featuredTickers.map(async (item) => {
      try {
        const exp = await explainPriceMovement(item.symbol, item.change);
        return {
          symbol: item.symbol,
          change: item.change,
          explanation: exp.summary,
          confidence: exp.confidence,
          sources: exp.sources,
        };
      } catch (err) {
        return {
          symbol: item.symbol,
          change: item.change,
          explanation: "Trading activity recorded with market context.",
          confidence: "Low",
          sources: [],
        };
      }
    })
  );

  return {
    category,
    sentiment: heat.sentiment,
    marketHeatScore: heat.score,
    marketHeat: heat,
    indices,
    topMovers,
    topHeadlines: articles.slice(0, 5).map((a) => a.title),
    articlesCount: articles.length,
    articles: articles.slice(0, 10),
    generatedAt: new Date().toISOString(),
  };
}

export default { getMarketKnowledge };
