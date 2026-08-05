/**
 * newsController.js
 *
 * Thin HTTP adapter layer. Controllers have one job:
 *   1. Parse the request
 *   2. Call the service
 *   3. Send a uniform JSON response
 *
 * No business logic lives here.
 */

import {
  getMarketNewsService,
  getStockNewsService,
  getMarketHeatService,
} from "../services/news/newsService.js";
import { explainPriceMovement }    from "../services/news/priceExplanationService.js";
import { getNewsDashboardService } from "../services/news/newsDashboardService.js";

// ── Debug / cache-bust helpers (imported directly from service layer) ──────
import { getCached }       from "../services/news/newsCacheService.js";
import { getCompanyNews }  from "../services/news/newsProvider.js";
import { normalizeArticles } from "../services/news/newsNormalizer.js";
import { analyzeArticles }  from "../services/news/sentimentService.js";
import NewsCache            from "../models/NewsCache.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ── GET /api/news/market ───────────────────────────────────────────────────

/**
 * Fetch general market news with pre-computed sentiment badges.
 *
 * Query params:
 *   ?category=general|forex|crypto|merger   (default: general)
 *
 * @route GET /api/news/market
 */
export const getMarketNews = catchAsync(async (req, res) => {
  const category = req.query.category || "general";
  const articles = await getMarketNewsService(category);

  return res.status(200).json({
    success: true,
    count:   articles.length,
    data:    articles,
  });
});

// ── GET /api/news/heat ─────────────────────────────────────────────────────

/**
 * Return the Market Heat score derived from current news sentiment.
 * This is the dashboard widget data source.
 *
 * Response shape:
 *   { score: 71, sentiment: "Bullish", badge: "🟢", breakdown: { bullish, bearish, neutral, total } }
 *
 * @route GET /api/news/heat
 */
export const getMarketHeat = catchAsync(async (req, res) => {
  const category = req.query.category || "general";
  const heat     = await getMarketHeatService(category);

  return res.status(200).json({
    success: true,
    data:    heat,
  });
});

// ── GET /api/news/:symbol ─────────────────────────────────────────────────

/**
 * Fetch stock-specific news for a given ticker symbol.
 * All articles include sentiment, sentimentScore, and badge.
 *
 * @route GET /api/news/:symbol
 * @param {string} symbol - Stock ticker (e.g. RELIANCE, INFY)
 */
export const getStockNews = catchAsync(async (req, res) => {
  const { symbol } = req.params;

  if (!symbol || symbol.trim().length === 0) {
    throw new AppError("Stock symbol is required.", 400, "MISSING_SYMBOL");
  }

  const articles = await getStockNewsService(symbol.trim().toUpperCase());

  return res.status(200).json({
    success: true,
    symbol:  symbol.toUpperCase(),
    count:   articles.length,
    data:    articles,
  });
});

// ── GET /api/news/explain/:symbol ──────────────────────────────────────────

/**
 * Generate or retrieve evidence-grounded AI explanation of today's price movement.
 *
 * @route GET /api/news/explain/:symbol
 * @param {string} symbol - Stock ticker (e.g. RELIANCE, TCS)
 * @query {string} [change] - Optional price change string (e.g. "+3.4%")
 */
export const explainStockPrice = catchAsync(async (req, res) => {
  const { symbol } = req.params;
  const priceChange = req.query.change || null;

  if (!symbol || symbol.trim().length === 0) {
    throw new AppError("Stock symbol is required.", 400, "MISSING_SYMBOL");
  }

  const explanation = await explainPriceMovement(symbol.trim().toUpperCase(), priceChange);

  return res.status(200).json({
    success: true,
    data: explanation,
  });
});

// ── GET /api/news/dashboard ────────────────────────────────────────────────

/**
 * Fetch full news dashboard payload (Market Heat, AI Summary, Trending, Latest, Top Movers).
 *
 * @route GET /api/news/dashboard
 */
export const getNewsDashboard = catchAsync(async (req, res) => {
  const dashboardData = await getNewsDashboardService();

  return res.status(200).json({
    success: true,
    data:    dashboardData,
  });
});

// ── GET /api/news/search?q= ───────────────────────────────────────────────

/**
 * Search news headlines and summaries by keyword or symbol.
 *
 * @route GET /api/news/search
 * @query {string} q - Query term (e.g. "TCS", "profit", "AI")
 */
export const searchNews = catchAsync(async (req, res) => {
  const queryTerm = (req.query.q || "").trim();
  if (!queryTerm) {
    throw new AppError("Search query string 'q' is required.", 400, "MISSING_QUERY");
  }

  // Check if query is a stock symbol vs keyword
  const isSymbol = /^[A-Z0-9]{2,10}$/i.test(queryTerm);
  let articles = [];

  if (isSymbol) {
    try {
      articles = await getStockNewsService(queryTerm.toUpperCase());
    } catch (e) {
      articles = [];
    }
  }

  // Fallback or broaden search across market news
  if (articles.length === 0) {
    const marketArticles = await getMarketNewsService("general");
    const termLower = queryTerm.toLowerCase();
    articles = marketArticles.filter(
      (a) =>
        (a.title && a.title.toLowerCase().includes(termLower)) ||
        (a.summary && a.summary.toLowerCase().includes(termLower)) ||
        (a.source && a.source.toLowerCase().includes(termLower))
    );
  }

  return res.status(200).json({
    success: true,
    query: queryTerm,
    count: articles.length,
    data:  articles,
  });
});

// ── GET /api/news/debug/:symbol ───────────────────────────────────────────

/**
 * Run each pipeline step individually and return a JSON diagnostic report.
 * Useful for debugging stale cache, missing articles, NIM connectivity, etc.
 *
 * @route GET /api/news/debug/:symbol
 * @param {string} symbol - Stock ticker (e.g. INFY, TCS)
 */
export const debugSymbol = async (req, res) => {
  const symbol    = (req.params.symbol || "").trim().toUpperCase();
  const cacheKey  = `company:${symbol}`;
  const report    = {
    symbol,
    timestamp: new Date().toISOString(),
    steps:     {},
    diagnosis: "",
  };

  // ── Step 1: Cache check ─────────────────────────────────────────────────
  try {
    const { default: NewsCache } = await import("../models/NewsCache.js");
    const doc = await NewsCache.findOne({ cacheKey }).lean();
    if (!doc) {
      report.steps.cache = { hit: false, key: cacheKey, expiresAt: null };
    } else {
      const now     = new Date();
      const expired = now > new Date(doc.expiresAt);
      report.steps.cache = {
        hit:          !expired,
        key:          cacheKey,
        expiresAt:    doc.expiresAt ?? null,
        articleCount: doc.articles?.length ?? 0,
        provider:     doc.provider ?? null,
        stale:        expired,
      };
    }
  } catch (err) {
    report.steps.cache = { ok: false, error: err.message };
  }

  // ── Step 2: RSS fetch ───────────────────────────────────────────────────
  let rawArticles = [];
  try {
    rawArticles = await getCompanyNews(symbol);
    report.steps.rss_fetch = {
      ok:            true,
      rawCount:      rawArticles.length,
      sampleHeadline: rawArticles[0]?.headline?.slice(0, 80) ?? null,
    };
  } catch (err) {
    report.steps.rss_fetch = { ok: false, rawCount: 0, error: err.message };
  }

  // ── Step 3: Normalise ───────────────────────────────────────────────────
  let normalized = [];
  try {
    normalized = normalizeArticles(rawArticles, 20);
    report.steps.normalize = { count: normalized.length };
  } catch (err) {
    report.steps.normalize = { ok: false, count: 0, error: err.message };
  }

  // ── Step 4: Sentiment ───────────────────────────────────────────────────
  try {
    const enriched = analyzeArticles(normalized);
    const bullish  = enriched.filter((a) => a.sentiment === "Bullish").length;
    const bearish  = enriched.filter((a) => a.sentiment === "Bearish").length;
    const neutral  = enriched.filter((a) => a.sentiment === "Neutral").length;
    report.steps.sentiment = { bullish, bearish, neutral };
  } catch (err) {
    report.steps.sentiment = { ok: false, error: err.message };
  }

  // ── Step 5: NIM availability ─────────────────────────────────────────────
  report.steps.nim_available = !!(
    process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim().length > 0
  );

  // ── Diagnosis summary ────────────────────────────────────────────────────
  const count = report.steps.rss_fetch?.rawCount ?? 0;
  if (report.steps.rss_fetch?.ok === false) {
    report.diagnosis = `RSS fetch failed: ${report.steps.rss_fetch.error}`;
  } else if (count === 0) {
    report.diagnosis = `RSS fetch succeeded but returned 0 articles. Check query or locale routing.`;
  } else if (report.steps.cache?.hit && report.steps.cache?.stale) {
    report.diagnosis = `Stale cache hit for ${cacheKey}. ${count} articles from RSS but cache may serve old data.`;
  } else {
    report.diagnosis = `Pipeline healthy. ${count} articles found.`;
  }

  return res.status(200).json(report);
};

// ── DELETE /api/news/cache/:symbol ────────────────────────────────────────

/**
 * Bust the MongoDB cache for a specific symbol or all symbols.
 *
 * @route DELETE /api/news/cache/:symbol
 * @param {string} symbol - Stock ticker OR the literal string 'all'
 */
export const bustCache = catchAsync(async (req, res) => {
  const symbol = (req.params.symbol || "").trim().toUpperCase();

  let result;
  let message;

  if (symbol === "ALL") {
    result  = await NewsCache.deleteMany({});
    message = `Deleted all ${result.deletedCount} cache entries.`;
  } else {
    // Delete both possible key patterns for this symbol
    result = await NewsCache.deleteMany({
      cacheKey: { $in: [`company:${symbol}`, `market:${symbol}`] },
    });
    message = `Deleted ${result.deletedCount} cache entr${
      result.deletedCount === 1 ? "y" : "ies"
    } for symbol "${symbol}".`;
  }

  return res.status(200).json({
    success: true,
    deleted: result.deletedCount,
    message,
  });
});

export default { getMarketNews, getMarketHeat, getStockNews, explainStockPrice, getNewsDashboard, searchNews, debugSymbol, bustCache };
