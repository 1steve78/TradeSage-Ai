/**
 * newsKnowledge.js
 *
 * News Knowledge Provider wrapping market headlines, sentiment scores,
 * and news search pipelines into structured JSON.
 */

import { getMarketNewsService, getStockNewsService, getMarketHeatService } from "../news/newsService.js";

/**
 * Generates unified News Knowledge Object.
 *
 * @param {string} [symbolOrCategory="general"] - Stock symbol or market category
 * @returns {Promise<object>} Structured news knowledge JSON
 */
export async function getNewsKnowledge(symbolOrCategory = "general") {
  const isSymbol = /^[A-Z0-9]{2,10}$/i.test(symbolOrCategory) && symbolOrCategory.toUpperCase() !== "GENERAL";

  if (isSymbol) {
    const symbol = symbolOrCategory.toUpperCase();
    const articles = await getStockNewsService(symbol);
    const heat = await getMarketHeatService("general");

    return {
      type: "company",
      query: symbol,
      articlesCount: articles.length,
      articles,
      marketHeat: heat,
      generatedAt: new Date().toISOString(),
    };
  }

  const articles = await getMarketNewsService(symbolOrCategory);
  const heat = await getMarketHeatService(symbolOrCategory);

  return {
    type: "market",
    category: symbolOrCategory,
    articlesCount: articles.length,
    articles,
    marketHeat: heat,
    generatedAt: new Date().toISOString(),
  };
}

export default { getNewsKnowledge };
