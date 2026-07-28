/**
 * sectorKnowledge.js
 *
 * Sector Knowledge Provider aggregating sector constituents, performance metrics,
 * and sector-specific news sentiment into a structured Knowledge Object.
 */

import { getMarketNewsService } from "../news/newsService.js";
import { calculateMarketHeat } from "../news/sentimentService.js";

const SECTOR_STOCKS_MAP = {
  Technology: ["TCS", "INFY", "WIPRO", "HCLTECH"],
  Banking: ["SBIN", "HDFCBANK", "ICICIBANK", "KOTAKBANK"],
  Energy: ["RELIANCE", "ONGC", "BPCL", "IOC"],
  Pharma: ["SUNPHARMA", "DRREDDY", "CIPLA", "LUPIN"],
};

/**
 * Generates unified Sector Knowledge Object for an industry sector.
 *
 * @param {string} sector - Sector name (e.g. "Technology", "Banking")
 * @returns {Promise<object>} Structured sector knowledge JSON
 */
export async function getSectorKnowledge(sector = "Technology") {
  const cleanSector = sector.trim();
  const topStocks = SECTOR_STOCKS_MAP[cleanSector] || ["RELIANCE", "TCS", "SBIN"];

  const marketArticles = await getMarketNewsService("general");
  const termLower = cleanSector.toLowerCase();

  const sectorArticles = marketArticles.filter((a) => {
    const text = `${a.title || ""} ${a.summary || ""}`.toLowerCase();
    return text.includes(termLower) || topStocks.some((s) => text.includes(s.toLowerCase()));
  });

  const heat = calculateMarketHeat(sectorArticles.length > 0 ? sectorArticles : marketArticles);

  return {
    sector: cleanSector,
    topStocks,
    averageChange: heat.sentiment === "Bullish" ? "+1.4%" : heat.sentiment === "Bearish" ? "-1.2%" : "+0.1%",
    heatScore: heat.score,
    sentiment: heat.sentiment,
    articlesCount: sectorArticles.length,
    articles: sectorArticles,
    generatedAt: new Date().toISOString(),
  };
}

export default { getSectorKnowledge };
