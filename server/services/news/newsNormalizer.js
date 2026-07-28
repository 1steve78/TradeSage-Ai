/**
 * newsNormalizer.js
 *
 * Single responsibility: transform raw Finnhub article objects into the
 * internal Article shape used by the rest of the pipeline.
 *
 * If the provider changes, ONLY this file needs to change.
 *
 * Finnhub raw shape:
 *   { id, headline, summary, source, datetime (unix), image, url, related }
 *
 * Internal shape:
 *   { id, title, summary, source, publishedAt (ISO Date), image, url, sentiment }
 */

/**
 * Normalise a single Finnhub article object.
 * Returns null for articles that are missing required fields so callers
 * can safely filter them out.
 *
 * @param {object} raw - Raw Finnhub article
 * @returns {object|null} Normalised article or null
 */
export function normalizeArticle(raw) {
  if (!raw || !raw.headline || !raw.url) return null;

  return {
    // Use Finnhub's numeric id converted to string; fall back to URL hash
    id:          String(raw.id ?? raw.url),
    title:       raw.headline.trim(),
    summary:     (raw.summary ?? "").trim(),
    source:      (raw.source  ?? "").trim(),
    // Finnhub datetime is a Unix timestamp (seconds); convert to JS Date
    publishedAt: raw.datetime
      ? new Date(raw.datetime * 1000)
      : new Date(),
    image:       raw.image  || null,
    url:         raw.url,
    // sentiment is null here — sentimentService will populate it
    sentiment:   null,
  };
}

/**
 * Normalise an array of Finnhub articles, filtering invalid entries.
 *
 * @param {object[]} rawArticles - Array of raw Finnhub articles
 * @param {number}   [limit]     - Optional max number of results
 * @returns {object[]} Array of normalised articles
 */
export function normalizeArticles(rawArticles, limit) {
  if (!Array.isArray(rawArticles)) return [];

  const normalised = rawArticles
    .map(normalizeArticle)
    .filter(Boolean); // drop nulls

  return limit ? normalised.slice(0, limit) : normalised;
}
