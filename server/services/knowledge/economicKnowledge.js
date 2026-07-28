/**
 * economicKnowledge.js
 *
 * Economic Knowledge Provider aggregating macroeconomic indicators, central bank policies,
 * market holidays, and upcoming financial calendar events.
 */

import { getMarketHeatService } from "../news/newsService.js";

/**
 * Generates unified Macroeconomic Knowledge Object.
 *
 * @returns {Promise<object>} Structured economic knowledge JSON
 */
export async function getEconomicKnowledge() {
  const heat = await getMarketHeatService("general");

  const events = [
    { name: "RBI Monetary Policy Committee (MPC)", status: "Completed", note: "Repo rate unchanged at 6.50%" },
    { name: "India Q1 GDP Estimates", status: "Upcoming", date: "2026-08-15" },
    { name: "US Federal Reserve FOMC Minutes", status: "Scheduled", date: "2026-08-01" },
  ];

  const holidays = [
    { name: "Independence Day", date: "2026-08-15", exchange: "NSE/BSE Closed" },
    { name: "Mahatma Gandhi Jayanti", date: "2026-10-02", exchange: "NSE/BSE Closed" },
  ];

  const earnings = [
    { symbol: "TCS", event: "Q2 Financial Results", date: "2026-10-12" },
    { symbol: "RELIANCE", event: "Q2 Financial Results", date: "2026-10-18" },
    { symbol: "INFY", event: "Q2 Financial Results", date: "2026-10-14" },
  ];

  return {
    macroSentiment: heat.sentiment,
    heatScore: heat.score,
    interestRates: {
      rbiRepoRate: "6.50%",
      usFedFundsRate: "5.25%",
      stance: "Calibrated Tightening / Neutral",
    },
    events,
    holidays,
    earnings,
    generatedAt: new Date().toISOString(),
  };
}

export default { getEconomicKnowledge };
