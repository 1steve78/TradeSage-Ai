/**
 * knowledgeService.js
 *
 * Unified Financial Knowledge Layer.
 * Single source of truth for all AI workflows (Portfolio AI, Market AI, Risk Engine, News AI).
 *
 * Exposes:
 *   getMarketKnowledge(category?)
 *   getStockKnowledge(symbol)
 *   getPortfolioKnowledge(holdings)
 *   getSectorKnowledge(sector)
 *   getEconomicKnowledge()
 */

import { getMarketNewsService, getStockNewsService, getMarketHeatService } from "./newsService.js";
import { explainPriceMovement } from "./priceExplanationService.js";
import { calculateMarketHeat } from "./sentimentService.js";

/**
 * Get unified knowledge about general market conditions, headlines, and sentiment heat.
 *
 * @param {string} [category="general"]
 * @returns {Promise<object>} Market knowledge payload
 */
export async function getMarketKnowledge(category = "general") {
  const [articles, heat] = await Promise.all([
    getMarketNewsService(category),
    getMarketHeatService(category),
  ]);

  return {
    category,
    heat,
    articlesCount: articles.length,
    articles: articles.slice(0, 10),
    topHeadlines: articles.slice(0, 5).map((a) => a.title),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get unified knowledge about a specific stock (news, sentiment, price movement explanation).
 *
 * @param {string} symbol - Stock ticker (e.g. "RELIANCE", "TCS")
 * @returns {Promise<object>} Stock knowledge payload
 */
export async function getStockKnowledge(symbol) {
  if (!symbol) throw new Error("[knowledgeService] Symbol is required.");

  const cleanSymbol = symbol.trim().toUpperCase();

  const [articles, explanation] = await Promise.all([
    getStockNewsService(cleanSymbol),
    explainPriceMovement(cleanSymbol).catch(() => ({
      summary: "No price movement explanation available.",
      confidence: "Low",
      sources: [],
    })),
  ]);

  const heat = calculateMarketHeat(articles);

  return {
    symbol: cleanSymbol,
    sentiment: heat.sentiment,
    sentimentScore: heat.score,
    articlesCount: articles.length,
    articles,
    explanation,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get unified knowledge for a portfolio of holdings by mapping each symbol to its knowledge context.
 *
 * @param {Array<{symbol: string}>} holdings - Array of position objects containing a symbol field
 * @returns {Promise<object>} Portfolio knowledge context
 */
export async function getPortfolioKnowledge(holdings = []) {
  if (!Array.isArray(holdings) || holdings.length === 0) {
    return {
      holdingsCount: 0,
      symbols: [],
      stockKnowledgeMap: {},
      overallSentiment: "Neutral",
      fetchedAt: new Date().toISOString(),
    };
  }

  const uniqueSymbols = [...new Set(holdings.map((h) => (h.symbol || "").toUpperCase()).filter(Boolean))];

  const stockKnowledgeList = await Promise.all(
    uniqueSymbols.slice(0, 6).map(async (symbol) => {
      try {
        return await getStockKnowledge(symbol);
      } catch (err) {
        return { symbol, sentiment: "Neutral", sentimentScore: 50, articlesCount: 0, articles: [] };
      }
    })
  );

  const stockKnowledgeMap = {};
  let totalScore = 0;

  stockKnowledgeList.forEach((sk) => {
    stockKnowledgeMap[sk.symbol] = sk;
    totalScore += sk.sentimentScore || 50;
  });

  const avgScore = stockKnowledgeList.length > 0 ? Math.round(totalScore / stockKnowledgeList.length) : 50;
  const overallSentiment = avgScore > 58 ? "Bullish" : avgScore < 42 ? "Bearish" : "Neutral";

  return {
    holdingsCount: holdings.length,
    symbols: uniqueSymbols,
    stockKnowledgeMap,
    averageSentimentScore: avgScore,
    overallSentiment,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get unified knowledge for a specific industry sector (e.g. "Technology", "Banking").
 *
 * @param {string} sector - Sector name
 * @returns {Promise<object>} Sector knowledge payload
 */
export async function getSectorKnowledge(sector = "General") {
  const marketKnowledge = await getMarketKnowledge("general");
  const termLower = sector.toLowerCase();

  const sectorArticles = marketKnowledge.articles.filter(
    (a) =>
      (a.title && a.title.toLowerCase().includes(termLower)) ||
      (a.summary && a.summary.toLowerCase().includes(termLower))
  );

  const heat = calculateMarketHeat(sectorArticles);

  return {
    sector,
    articlesCount: sectorArticles.length,
    sentiment: heat.sentiment,
    sentimentScore: heat.score,
    articles: sectorArticles,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get macroeconomic knowledge payload.
 *
 * @returns {Promise<object>} Economic knowledge context
 */
export async function getEconomicKnowledge() {
  const marketKnowledge = await getMarketKnowledge("general");
  return {
    macroSentiment: marketKnowledge.heat.sentiment,
    heatScore: marketKnowledge.heat.score,
    topHeadlines: marketKnowledge.topHeadlines,
    fetchedAt: new Date().toISOString(),
  };
}

export default {
  getMarketKnowledge,
  getStockKnowledge,
  getPortfolioKnowledge,
  getSectorKnowledge,
  getEconomicKnowledge,
};
