/**
 * newsCacheService.js
 *
 * Single responsibility: read from and write to the NewsCache collection.
 *
 * The controller and newsService should never touch NewsCache directly.
 * They call getOrFetch() — caching is completely transparent to them.
 *
 * Flow:
 *   getOrFetch(cacheKey, type, fetchFn)
 *     ↓
 *   Find document by cacheKey
 *     ↓
 *   Still valid (expiresAt > now)?
 *     ↓ yes           ↓ no
 *   Return cached   Call fetchFn()
 *   articles        Save result → Return articles
 */

import NewsCache from "../../models/NewsCache.js";
import newsConfig from "../../config/newsConfig.js";

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Calculate the expiry Date for a new cache document.
 * Reads cacheDuration (minutes) from newsConfig.
 */
function buildExpiresAt() {
  const ms = newsConfig.cacheDuration * 60 * 1000;
  return new Date(Date.now() + ms);
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Retrieve articles from cache. Returns null on a cache miss.
 *
 * @param {string} cacheKey - e.g. "market:general" or "company:RELIANCE"
 * @returns {Promise<object[]|null>} Cached articles or null
 */
export async function getCached(cacheKey) {
  const doc = await NewsCache.findOne({ cacheKey }).lean();
  if (!doc) return null;

  // Double-check freshness (TTL index may not have fired yet)
  if (new Date() > new Date(doc.expiresAt)) return null;

  return doc.articles;
}

/**
 * Write articles into the cache, upserting by cacheKey.
 *
 * @param {string}   cacheKey - Lookup key
 * @param {string}   type     - "market" | "company"
 * @param {object[]} articles - Normalised articles to store
 * @returns {Promise<void>}
 */
export async function setCached(cacheKey, type, articles) {
  const expiresAt = buildExpiresAt();

  await NewsCache.findOneAndUpdate(
    { cacheKey },
    {
      $set: {
        cacheKey,
        type,
        provider:  newsConfig.provider,
        articles,
        fetchedAt: new Date(),
        expiresAt,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );
}

/**
 * The main entry point.
 *
 * Returns cached articles if fresh, otherwise calls fetchFn(), caches
 * the result, and returns it. The caller never needs to know which path ran.
 *
 * @param {string}   cacheKey - Unique cache key for this request
 * @param {string}   type     - "market" | "company"
 * @param {Function} fetchFn  - Async function that fetches & returns articles[]
 * @returns {Promise<object[]>} Articles (cached or freshly fetched)
 */
export async function getOrFetch(cacheKey, type, fetchFn) {
  // ── 1. Cache hit? ─────────────────────────────────────────────────
  const doc = await NewsCache.findOne({ cacheKey }).lean();
  if (doc && new Date() <= new Date(doc.expiresAt)) {
    console.log(
      `[newsCacheService] Cache HIT  → ${cacheKey}` +
      ` | articles: ${doc.articles?.length ?? 0}` +
      ` | expiresAt: ${doc.expiresAt?.toISOString?.() ?? doc.expiresAt}`
    );
    return doc.articles;
  }

  // ── 2. Cache miss — fetch from provider ───────────────────────────────
  console.log(`[newsCacheService] Cache MISS → ${cacheKey} — fetching…`);
  const articles = await fetchFn();

  // ── 3. Store result ──────────────────────────────────────────────────
  await setCached(cacheKey, type, articles);
  console.log(`[newsCacheService] Stored ${articles.length} articles for ${cacheKey}`);
  return articles;
}

export default { getCached, setCached, getOrFetch };
