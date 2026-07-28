/**
 * sentimentService.js
 *
 * Rule-based sentiment engine for news articles.
 *
 * Pipeline per article:
 *   headline + summary → keyword scan → raw score → clamp → label → badge
 *
 * Pipeline for a batch:
 *   articles[] → analyzeArticles → weighted overall → marketHeat
 *
 * This is intentionally deterministic and costs nothing to run.
 * The NVIDIA NIM is reserved for the optional "explain why" narrative
 * (Milestone 3), not for classification.
 */

// ── Keyword Dictionaries ───────────────────────────────────────────────────
// Add terms carefully — false positives are worse than misses in finance.

const BULLISH_KEYWORDS = [
  // Earnings & revenue
  "beats", "beat", "exceeds", "record", "profit", "profits", "earnings",
  "revenue growth", "raises guidance", "raises forecast", "outperform",
  // Business momentum
  "surge", "surges", "rallies", "gains", "recovery", "expansion", "expands",
  "buyback", "buy back", "dividend", "acquisition", "partnership", "deal",
  "launch", "launches", "approval", "approved", "awarded", "contract",
  // Analyst & market signals
  "upgrade", "upgraded", "overweight", "buy rating", "strong buy",
  "positive outlook", "bullish", "upside", "growth", "strong",
  // Macro positive
  "rate cut", "stimulus", "investment", "gdp growth", "jobs added",
];

const BEARISH_KEYWORDS = [
  // Earnings misses
  "miss", "misses", "missed", "disappoints", "disappointing", "below expectations",
  "loss", "losses", "deficit", "write-off", "write-down", "impairment",
  "lowers guidance", "lowers forecast", "cuts guidance",
  // Business distress
  "decline", "declines", "falls", "drops", "plunges", "slump",
  "layoffs", "layoff", "job cuts", "restructuring", "bankruptcy", "default",
  "recall", "shutdown", "fraud", "scandal", "probe", "investigation",
  "lawsuit", "fined", "penalty", "regulatory action",
  // Analyst & market signals
  "downgrade", "downgraded", "underweight", "sell rating", "bearish",
  "warning", "risk", "concern", "uncertainty", "slowdown",
  // Macro negative
  "rate hike", "inflation surge", "recession", "contraction",
];

// ── Scoring Constants ──────────────────────────────────────────────────────
const NEUTRAL_BASELINE  = 50;
const BULLISH_DELTA     = 8;
const BEARISH_DELTA     = 8;
const SCORE_MIN         = 0;
const SCORE_MAX         = 100;
const BULLISH_THRESHOLD = 58; // score > this → Bullish
const BEARISH_THRESHOLD = 42; // score < this → Bearish

// ── Recency Weights (newest → oldest) ────────────────────────────────────
// Applied when computing overall market heat from an article batch.
const RECENCY_WEIGHTS = [0.40, 0.30, 0.20, 0.10];

// ── Private Helpers ────────────────────────────────────────────────────────

/**
 * Scan text against a keyword list. Returns the count of matches found.
 * Uses word-boundary-aware matching to avoid partial hits (e.g. "miss" in "mission").
 *
 * @param {string}   text     - Lowercased text to scan
 * @param {string[]} keywords - Keyword list
 * @returns {number} Hit count
 */
function countKeywordHits(text, keywords) {
  let hits = 0;
  for (const kw of keywords) {
    // Escape for regex; use word boundaries where sensible
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escaped}\\b`, "i");
    if (pattern.test(text)) hits++;
  }
  return hits;
}

/**
 * Clamp a numeric value between min and max.
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Derive a sentiment label from a numeric score.
 *
 * @param {number} score - 0–100
 * @returns {"Bullish"|"Bearish"|"Neutral"}
 */
function scoreToLabel(score) {
  if (score > BULLISH_THRESHOLD) return "Bullish";
  if (score < BEARISH_THRESHOLD) return "Bearish";
  return "Neutral";
}

/**
 * Map a label to a UI badge character.
 *
 * @param {"Bullish"|"Bearish"|"Neutral"} label
 * @returns {string}
 */
function labelToBadge(label) {
  const MAP = { Bullish: "🟢", Bearish: "🔴", Neutral: "🟡" };
  return MAP[label] ?? "🟡";
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Analyse a single normalised article and attach sentiment metadata.
 *
 * @param {object} article - Normalised article (from newsNormalizer)
 * @returns {object} Article with { sentiment, sentimentScore, badge } populated
 */
export function analyzeArticle(article) {
  if (!article) return article;

  // Combine headline + summary into one searchable text block
  const text = `${article.title ?? ""} ${article.summary ?? ""}`.toLowerCase();

  const bullishHits = countKeywordHits(text, BULLISH_KEYWORDS);
  const bearishHits = countKeywordHits(text, BEARISH_KEYWORDS);

  const rawScore = NEUTRAL_BASELINE
    + bullishHits * BULLISH_DELTA
    - bearishHits * BEARISH_DELTA;

  const score     = clamp(Math.round(rawScore), SCORE_MIN, SCORE_MAX);
  const sentiment = scoreToLabel(score);
  const badge     = labelToBadge(sentiment);

  return {
    ...article,
    sentiment,
    sentimentScore: score,
    badge,
  };
}

/**
 * Analyse an array of normalised articles.
 * Each article is enriched with { sentiment, sentimentScore, badge }.
 *
 * @param {object[]} articles - Array of normalised articles
 * @returns {object[]} Articles with sentiment fields attached
 */
export function analyzeArticles(articles) {
  if (!Array.isArray(articles)) return [];
  return articles.map(analyzeArticle);
}

/**
 * Calculate an overall Market Heat score from a batch of analysed articles.
 *
 * Newer articles are weighted more heavily using RECENCY_WEIGHTS.
 * Articles beyond the weight array receive the smallest available weight.
 *
 * @param {object[]} articles - Already-analysed articles (must have sentimentScore)
 * @returns {{
 *   score:     number,          // 0–100
 *   sentiment: string,          // "Bullish" | "Bearish" | "Neutral"
 *   badge:     string,          // emoji
 *   breakdown: {
 *     bullish: number,          // count
 *     bearish: number,          // count
 *     neutral: number,          // count
 *     total:   number,
 *   }
 * }}
 */
export function calculateMarketHeat(articles) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return {
      score:     NEUTRAL_BASELINE,
      sentiment: "Neutral",
      badge:     "🟡",
      breakdown: { bullish: 0, bearish: 0, neutral: 0, total: 0 },
    };
  }

  // Sort by publishedAt descending (newest first) for weighting
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  // Weighted average of sentimentScore values
  let weightedSum   = 0;
  let totalWeight   = 0;
  const fallbackW   = RECENCY_WEIGHTS[RECENCY_WEIGHTS.length - 1];
  const breakdown   = { bullish: 0, bearish: 0, neutral: 0, total: sorted.length };

  for (let i = 0; i < sorted.length; i++) {
    const article = sorted[i];
    const score   = article.sentimentScore ?? NEUTRAL_BASELINE;
    const weight  = RECENCY_WEIGHTS[i] ?? fallbackW;

    weightedSum += score * weight;
    totalWeight += weight;

    // Tally for breakdown
    const label = article.sentiment ?? scoreToLabel(score);
    if (label === "Bullish") breakdown.bullish++;
    else if (label === "Bearish") breakdown.bearish++;
    else breakdown.neutral++;
  }

  const finalScore = totalWeight > 0
    ? clamp(Math.round(weightedSum / totalWeight), SCORE_MIN, SCORE_MAX)
    : NEUTRAL_BASELINE;

  const sentiment = scoreToLabel(finalScore);

  return {
    score:     finalScore,
    sentiment,
    badge:     labelToBadge(sentiment),
    breakdown,
  };
}

export default { analyzeArticle, analyzeArticles, calculateMarketHeat };
