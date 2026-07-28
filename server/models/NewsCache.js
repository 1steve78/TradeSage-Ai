import mongoose from "mongoose";

/**
 * Normalised article sub-document stored inside each cache entry.
 * Uses our internal field names — never Finnhub's raw names.
 */
const ArticleSchema = new mongoose.Schema(
  {
    id:             { type: String, required: true },
    title:          { type: String, required: true },
    summary:        { type: String, default: "" },
    source:         { type: String, default: "" },
    publishedAt:    { type: Date,   required: true },
    image:          { type: String, default: null },
    url:            { type: String, required: true },
    // Populated by sentimentService
    sentiment:      { type: String, default: null },   // "Bullish" | "Bearish" | "Neutral"
    sentimentScore: { type: Number, default: null },   // 0–100
    badge:          { type: String, default: null },   // "🟢" | "🔴" | "🟡"
  },
  { _id: false }
);

/**
 * NewsCache — one document per unique cache key (symbol or category).
 *
 * TTL index on `expiresAt` means MongoDB auto-removes stale entries.
 * No cron job required.
 */
const NewsCacheSchema = new mongoose.Schema(
  {
    // Lookup key: stock symbol (e.g. "RELIANCE") or category (e.g. "general")
    cacheKey: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },

    // "market" | "company" — determines which Finnhub endpoint was called
    type: {
      type:    String,
      enum:    ["market", "company"],
      required: true,
    },

    // Which data provider populated this cache entry
    provider: {
      type:    String,
      default: "finnhub",
    },

    // Normalised articles array
    articles: {
      type:    [ArticleSchema],
      default: [],
    },

    // When this entry was fetched from the provider
    fetchedAt: {
      type:    Date,
      default: Date.now,
    },

    // MongoDB TTL index will delete this document automatically after this timestamp
    expiresAt: {
      type:     Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ── Indexes ────────────────────────────────────────────────────────────────
// TTL: MongoDB removes the document when current time passes expiresAt
NewsCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const NewsCache = mongoose.model("NewsCache", NewsCacheSchema);

export default NewsCache;
