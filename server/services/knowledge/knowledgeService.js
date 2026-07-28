/**
 * knowledgeService.js
 *
 * Central Unified Financial Knowledge Service Facade.
 *
 * This service is the SINGLE interface between TradeSage AI's data infrastructure
 * (MongoDB, Finnhub, SmartAPI, Analytics Engine, Sentiment Service) and all AI Graphs / Models.
 *
 * AI workflows NEVER query database models or APIs directly — they ask knowledgeService.
 */

import { getPortfolioKnowledge } from "./portfolioKnowledge.js";
import { getMarketKnowledge }    from "./marketKnowledge.js";
import { getStockKnowledge }     from "./stockKnowledge.js";
import { getSectorKnowledge }    from "./sectorKnowledge.js";
import { getEconomicKnowledge }  from "./economicKnowledge.js";
import { getNewsKnowledge }      from "./newsKnowledge.js";

export {
  getPortfolioKnowledge,
  getMarketKnowledge,
  getStockKnowledge,
  getSectorKnowledge,
  getEconomicKnowledge,
  getNewsKnowledge,
};

export default {
  getPortfolioKnowledge,
  getMarketKnowledge,
  getStockKnowledge,
  getSectorKnowledge,
  getEconomicKnowledge,
  getNewsKnowledge,
};
