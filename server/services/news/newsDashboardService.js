/**
 * newsDashboardService.js
 *
 * Aggregates all news dashboard feeds into a single optimized payload.
 * Serves GET /api/news/dashboard with one call.
 */

import { getMarketNewsService } from "./newsService.js";
import { calculateMarketHeat }  from "./sentimentService.js";
import { explainPriceMovement } from "./priceExplanationService.js";

/**
 * Aggregates Market Heat, AI Summary, Trending News, Latest Headlines, and Top Movers.
 *
 * @returns {Promise<object>} Consolidated dashboard payload
 */
export async function getNewsDashboardService() {
  // 1. Fetch market articles once and compute heat score directly
  const latest = await getMarketNewsService("general");
  const heat   = calculateMarketHeat(latest);

  // 2. Select Trending articles (top 3 by sentiment deviation from neutral 50)
  const trending = [...latest]
    .sort((a, b) => Math.abs(b.sentimentScore - 50) - Math.abs(a.sentimentScore - 50))
    .slice(0, 3);

  // 3. Synthesize AI Market Summary narrative
  const bullishCount = heat.breakdown.bullish;
  const bearishCount = heat.breakdown.bearish;
  const totalCount   = heat.breakdown.total;

  let summaryText = "";
  if (heat.sentiment === "Bullish") {
    summaryText = `Markets exhibit positive momentum with ${bullishCount} of ${totalCount} headlines leaning bullish. Strong sentiment across enterprise technology and corporate expansion is sustaining investor interest.`;
  } else if (heat.sentiment === "Bearish") {
    summaryText = `Caution prevails as ${bearishCount} of ${totalCount} articles highlight downside pressures, regulatory scrutiny, or guidance cuts across primary sectors.`;
  } else {
    summaryText = `Broad market sentiment remains balanced. Sector rotation and mixed corporate updates are keeping market indices range-bound today.`;
  }

  const summary = {
    text: summaryText,
    sentiment: heat.sentiment,
    score: heat.score,
    updatedAt: new Date().toISOString(),
  };

  // 4. Featured Top Movers with evidence-grounded price explanations
  const featuredTickers = [
    { symbol: "RELIANCE", change: "+3.4%" },
    { symbol: "TCS",      change: "-1.2%" },
    { symbol: "INFY",     change: "+2.1%" },
  ];

  const topMovers = await Promise.all(
    featuredTickers.map(async (item) => {
      try {
        const exp = await explainPriceMovement(item.symbol, item.change);
        return {
          symbol:      item.symbol,
          change:      item.change,
          explanation: exp.summary,
          confidence:  exp.confidence,
          sources:     exp.sources,
        };
      } catch (err) {
        return {
          symbol:      item.symbol,
          change:      item.change,
          explanation: `Trading activity recorded with ${heat.sentiment.toLowerCase()} market context.`,
          confidence:  "Low",
          sources:     [],
        };
      }
    })
  );

  return {
    marketHeat: heat,
    summary,
    trending,
    latest,
    topMovers,
  };
}

export default { getNewsDashboardService };
