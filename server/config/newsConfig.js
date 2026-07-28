import dotenv from "dotenv";
dotenv.config();

/**
 * Central configuration for the news pipeline.
 * All magic numbers live here — nowhere else.
 */
const newsConfig = {
  // Which provider is active
  provider: "google_rss",

  // How long a cached result stays valid (in minutes)
  cacheDuration: Number(process.env.NEWS_CACHE_MINUTES) || 15,

  // Maximum articles returned per request
  maxArticles: 20,

  // How many days back to fetch for company news
  companyNewsDaysBack: 7,

  // Finnhub market news categories
  categories: {
    general: "general",
    forex: "forex",
    crypto: "crypto",
    merger: "merger",
  },
};

export default newsConfig;
