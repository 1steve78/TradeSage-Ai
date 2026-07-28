/**
 * newsService.js
 *
 * Public interface for the entire news pipeline.
 * Controllers call ONLY these functions — nothing else.
 *
 * Full pipeline per call:
 *   newsProvider (Finnhub) → newsNormalizer → sentimentService → newsCacheService
 *
 * Every article returned to the frontend already has:
 *   { sentiment, sentimentScore, badge }
 *
 * Exposed functions:
 *   getMarketNews(category?)
 *   getStockNews(symbol)
 *   getMarketHeat(category?)
 */

import newsConfig                             from "../../config/newsConfig.js";
import { getMarketNews, getCompanyNews }       from "./newsProvider.js";
import { normalizeArticles }                   from "./newsNormalizer.js";
import { analyzeArticles, calculateMarketHeat } from "./sentimentService.js";
import { getOrFetch }                           from "./newsCacheService.js";

// ── Cache key builders (keep them consistent) ─────────────────────────────
const marketKey  = (cat)    => `market:${cat}`;
const companyKey = (symbol) => `company:${symbol.toUpperCase()}`;

// ── Internal fetch + process pipeline ─────────────────────────────────────

/**
 * Fetch market news from Finnhub, normalise, and enrich with sentiment.
 * Called by getOrFetch only on a cache miss.
 *
 * @param {string} category - Finnhub category string
 * @returns {Promise<object[]>} Normalised + sentiment-enriched articles
 */
async function fetchAndProcessMarketNews(category) {
  const raw        = await getMarketNews(category);
  const normalised = normalizeArticles(raw, newsConfig.maxArticles);
  return analyzeArticles(normalised);
}

/**
 * Fetch company news via Google News RSS, normalise, and enrich with sentiment.
 * Called by getOrFetch only on a cache miss.
 *
 * Google News automatically returns Indian-language sources for NSE stocks
 * (via locale routing in newsProvider), so no manual fallback is needed.
 *
 * @param {string} symbol - Stock ticker
 * @returns {Promise<object[]>} Normalised + sentiment-enriched articles
 */
async function fetchAndProcessCompanyNews(symbol) {
  const raw        = await getCompanyNews(symbol);
  const normalised = normalizeArticles(raw, newsConfig.maxArticles);
  return analyzeArticles(normalised);
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Get general market news, with caching and sentiment pre-applied.
 *
 * @param {string} [category="general"] - Finnhub category
 * @returns {Promise<object[]>} Articles with sentiment
 */
export async function getMarketNewsService(category = newsConfig.categories.general) {
  const cacheKey = marketKey(category);
  return getOrFetch(
    cacheKey,
    "market",
    () => fetchAndProcessMarketNews(category)
  );
}

/**
 * Get company-specific news for a stock symbol, with caching and sentiment.
 *
 * @param {string} symbol - Stock ticker (e.g. "RELIANCE")
 * @returns {Promise<object[]>} Articles with sentiment
 */
export async function getStockNewsService(symbol) {
  if (!symbol) throw new Error("[newsService] getStockNews: symbol is required");

  const cacheKey = companyKey(symbol);
  return getOrFetch(
    cacheKey,
    "company",
    () => fetchAndProcessCompanyNews(symbol)
  );
}

/**
 * Calculate a Market Heat score from the current market news batch.
 * Piggybacks on getMarketNewsService so caching is automatically shared.
 *
 * Returns:
 *   { score, sentiment, badge, breakdown }
 *
 * @param {string} [category="general"]
 * @returns {Promise<object>} Market heat object
 */
export async function getMarketHeatService(category = newsConfig.categories.general) {
  const articles = await getMarketNewsService(category);
  return calculateMarketHeat(articles);
}

export default { getMarketNewsService, getStockNewsService, getMarketHeatService };
