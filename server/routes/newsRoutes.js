/**
 * newsRoutes.js
 *
 * Exposes the news & sentiment pipeline over HTTP.
 *
 * Routes:
 *   GET    /api/news/market          → general market news + sentiment badges
 *   GET    /api/news/heat            → Market Heat score (dashboard widget)
 *   GET    /api/news/debug/:symbol   → full pipeline diagnostic report
 *   DELETE /api/news/cache/:symbol   → bust the MongoDB cache for a symbol (or 'all')
 *   GET    /api/news/:symbol         → stock-specific news + sentiment badges
 *
 * Note: these routes are intentionally public (no `protect` middleware)
 * so they can power the landing page and unauthenticated previews.
 * Add `protect` to any route that returns user-specific data.
 */

import express                               from "express";
import { getMarketNews, getMarketHeat, getStockNews, explainStockPrice, getNewsDashboard, searchNews, debugSymbol, bustCache } from "../controllers/newsController.js";

const router = express.Router();

// ── Market-level endpoints ─────────────────────────────────────────────────
// IMPORTANT: /market, /heat, /dashboard, /search, /debug, and /cache must be
// declared BEFORE /:symbol so Express doesn't treat these as symbol path params.

router.get("/dashboard",       getNewsDashboard);
router.get("/market",          getMarketNews);
router.get("/heat",            getMarketHeat);
router.get("/search",          searchNews);
router.get("/explain/:symbol", explainStockPrice);

// ── Observability / maintenance ────────────────────────────────────────────
router.get("/debug/:symbol",   debugSymbol);   // pipeline diagnostic report
router.delete("/cache/:symbol", bustCache);    // bust stale MongoDB cache

// ── Stock-specific endpoint ───────────────────────────────────────────────
router.get("/:symbol",         getStockNews);

export default router;
