/**
 * newsProvider.js
 *
 * Single responsibility: fetch raw news articles.
 *
 * PROVIDER: Google News RSS (replaces Finnhub company-news)
 *
 * Why Google News RSS over Finnhub for Indian markets:
 *   - Zero API key / rate limits
 *   - Native understanding of Indian tickers — no .NS/.BO suffix hacks needed
 *   - Sources: Moneycontrol, Livemint, Economic Times, Bloomberg India, Reuters
 *   - RSS is a 20-year-old XML standard — it doesn't break when UIs change
 *   - Finnhub free tier has near-zero coverage for NSE/BSE stocks
 *
 * Exported interface (identical to the old Finnhub provider so the rest
 * of the pipeline — normalizer, sentiment, cache — needs ZERO changes):
 *   getMarketNews(category?)   → raw article objects[]
 *   getCompanyNews(symbol)     → raw article objects[]
 *
 * Raw article shape (matches what newsNormalizer.js already expects):
 *   { id, headline, summary, source, datetime (unix seconds), image, url }
 */

import Parser from "rss-parser";

const rssParser = new Parser({
  // Some Google RSS feeds set a very short timeout — give it breathing room
  timeout: 12_000,
  headers: {
    // Identify as a standard RSS reader; avoids occasional bot challenges
    "User-Agent": "Mozilla/5.0 (compatible; RSSReader/1.0)",
  },
});

// ── Region helpers ────────────────────────────────────────────────────────

// Known Indian NSE tickers — used to route to Indian news locale
const NSE_SYMBOLS = new Set([
  "RELIANCE", "TCS", "INFY", "WIPRO", "HDFCBANK", "ICICIBANK", "SBIN",
  "BAJFINANCE", "HINDUNILVR", "MARUTI", "TATAMOTORS", "TATASTEEL",
  "TECHM", "LTIM", "HCLTECH", "AXISBANK", "KOTAKBANK", "LT",
  "SUNPHARMA", "DRREDDY", "CIPLA", "DIVISLAB", "ADANIPORTS",
  "ADANIENT", "COALINDIA", "ONGC", "BPCL", "POWERGRID",
  "NTPC", "JSWSTEEL", "HINDALCO", "VEDL", "GRASIM",
  "ASIANPAINT", "TITAN", "NESTLEIND", "BRITANNIA", "PIDILITIND",
  "HAVELLS", "VOLTAS", "MUTHOOTFIN", "BAJAJFINSV", "HDFCLIFE",
  "SBILIFE", "ICICIPRULI", "NAUKRI", "PAYTM", "ZOMATO",
  "DMART", "TRENT", "IRCTC", "PNB", "CANBK", "BANDHANBNK",
  "FEDERALBNK", "IDFCFIRSTB", "INDUSINDBK", "RBLBANK", "YESBANK",
  "ITC", "BHARTIARTL",
]);

function isIndianStock(symbol) {
  // Strip any existing exchange suffix before checking
  const clean = symbol.replace(/\.(NS|BO)$/i, "").toUpperCase();
  return NSE_SYMBOLS.has(clean);
}

// ── Google News RSS URL builders ──────────────────────────────────────────

/**
 * Build a locale-targeted Google News RSS search URL.
 *
 * @param {string} query       - Search query string (already human-readable)
 * @param {boolean} indianMode - true → Indian publishers, false → Global
 * @returns {string} Full RSS URL
 */
function buildRssUrl(query, indianMode) {
  const encoded = encodeURIComponent(query);
  const locale  = indianMode
    ? "hl=en-IN&gl=IN&ceid=IN:en"   // Moneycontrol, Mint, ET, etc.
    : "hl=en-US&gl=US&ceid=US:en";  // Bloomberg, Reuters, CNBC, etc.
  return `https://news.google.com/rss/search?q=${encoded}&${locale}`;
}

// ── Raw shape converter ───────────────────────────────────────────────────

/**
 * Convert a parsed RSS item to the raw Finnhub-compatible shape that
 * newsNormalizer.js already knows how to handle.
 *
 * Finnhub shape (what normalizer reads):
 *   { id, headline, summary, source, datetime (unix s), image, url }
 *
 * @param {object} item - rss-parser item
 * @returns {object} Finnhub-compatible raw article
 */
function rssItemToRaw(item) {
  let dt;
  try {
    dt = item.pubDate ? Math.floor(new Date(item.pubDate).getTime() / 1000) : Math.floor(Date.now() / 1000);
    if (isNaN(dt)) dt = Math.floor(Date.now() / 1000);
  } catch (err) {
    dt = Math.floor(Date.now() / 1000);
  }

  return {
    // id: prefer guid, fall back to link
    id:       item.guid || item.link || String(Date.now()),
    headline: (item.title || "").trim(),
    summary:  (item.contentSnippet || item.content || "").trim(),
    source:   item.source?.title || item.creator || "Google News",
    // pubDate is an ISO string from rss-parser; convert to unix seconds
    datetime: dt,
    // RSS feeds don't carry reliable images; normalizer handles null gracefully
    image:    null,
    url:      item.link || "",
  };
}

// ── Shared RSS fetch helper ───────────────────────────────────────────────

/**
 * Fetch and parse a Google News RSS feed URL, returning raw article objects.
 *
 * @param {string} url   - Full Google News RSS URL
 * @param {number} limit - Max articles to return
 * @returns {Promise<object[]>} Raw article objects (Finnhub-compatible shape)
 */
async function fetchRss(url, limit = 20) {
  const feed = await rssParser.parseURL(url);

  if (!feed.items || feed.items.length === 0) return [];

  const rawItems = [];
  for (const item of feed.items.slice(0, limit)) {
    const raw = rssItemToRaw(item);
    if (!raw.headline || !raw.url) {
      console.warn(`[newsProvider] Dropped item: missing headline or url`, { title: item.title?.slice(0, 50) });
      continue;
    }
    rawItems.push(raw);
  }

  return rawItems;
}

// ── Public API (same interface as old Finnhub provider) ───────────────────

/**
 * Fetch general market / financial news via Google News RSS.
 *
 * Replaces: Finnhub GET /news?category=general
 *
 * @param {string} [category="general"] - Category hint (maps to query terms)
 * @returns {Promise<object[]>} Raw articles (Finnhub-compatible shape)
 */
export async function getMarketNews(category = "general") {
  const queryMap = {
    general: "stock market financial news today",
    forex:   "forex currency exchange rate news today",
    crypto:  "cryptocurrency bitcoin ethereum news today",
    merger:  "merger acquisition corporate deal news today",
  };

  const query = queryMap[category] ?? queryMap.general;
  const url   = buildRssUrl(query, false); // global financial news

  try {
    const articles = await fetchRss(url);
    console.log(`[newsProvider] getMarketNews (${category}): ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error("[newsProvider] getMarketNews error:", error.message);
    throw new Error(`Failed to fetch market news: ${error.message}`);
  }
}

/**
 * Fetch company-specific news via Google News RSS.
 *
 * Replaces: Finnhub GET /company-news?symbol=TATAMOTORS.NS&from=...&to=...
 *
 * Automatically routes Indian tickers to the Indian news locale
 * (hl=en-IN&gl=IN) so results come from Moneycontrol, Economic Times,
 * Livemint etc. rather than US-centric sources that have no Indian coverage.
 *
 * @param {string} symbol    - Stock ticker (e.g. "TATAMOTORS", "AAPL")
 * @param {number} [daysBack] - Not used by RSS (kept for interface parity)
 * @returns {Promise<object[]>} Raw articles (Finnhub-compatible shape)
 */
export async function getCompanyNews(symbol, daysBack) { // eslint-disable-line no-unused-vars
  if (!symbol) throw new Error("[newsProvider] getCompanyNews: symbol is required");

  // Clean symbol: remove exchange suffixes (.NS, .BO) and equity suffixes (-EQ)
  const clean      = symbol.replace(/\.(NS|BO)$/i, "").replace(/-EQ$/i, "").trim().toUpperCase();
  const indian     = isIndianStock(clean);
  const query      = indian
    ? `${clean} stock share price NSE`   // Indian phrasing
    : `${clean} stock earnings news`;    // US phrasing

  const url = buildRssUrl(query, indian);

  console.log(`[newsProvider] getCompanyNews: "${clean}" (raw: "${symbol}") → ${indian ? "IN locale" : "US locale"}`);

  try {
    let articles = await fetchRss(url);

    // Fallback: If 0 articles found, try generic search query
    if (!articles || articles.length === 0) {
      console.log(`[newsProvider] Primary RSS query returned 0 items for ${clean}. Trying generic query fallback...`);
      const fallbackUrl = buildRssUrl(`${clean} stock news`, indian);
      articles = await fetchRss(fallbackUrl);
    }

    // Second Fallback: If still 0 articles, try global locale
    if (!articles || articles.length === 0) {
      console.log(`[newsProvider] Secondary RSS query returned 0 items for ${clean}. Trying global locale fallback...`);
      const globalUrl = buildRssUrl(`${clean} company stock`, false);
      articles = await fetchRss(globalUrl);
    }

    console.log(`[newsProvider] ${clean}: ${articles.length} articles returned`);
    return articles;
  } catch (error) {
    console.error(`[newsProvider] getCompanyNews error (${clean}):`, error.message);
    throw new Error(`Failed to fetch company news for ${symbol}: ${error.message}`);
  }
}

export default { getMarketNews, getCompanyNews };
