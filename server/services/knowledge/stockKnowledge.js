/**
 * stockKnowledge.js
 *
 * Gathers company metadata, technical indicators, news coverage, sentiment scores,
 * and AI price movement explanations into a unified Stock Knowledge Object.
 */

import { getStockNewsService } from "../news/newsService.js";
import { calculateMarketHeat } from "../news/sentimentService.js";
import { explainPriceMovement } from "../news/priceExplanationService.js";

const STOCK_METADATA = {
  TCS: {
    symbol: "TCS",
    companyName: "Tata Consultancy Services Ltd.",
    exchange: "NSE",
    sector: "Technology / IT Services",
    price: 3856.0,
    changePct: "+1.23%",
    pe: 28.45,
    rsi: "62.4 (Neutral)",
    macd: "Bullish Crossover",
    dma50: "₹3,720.50",
    dma200: "₹3,540.20",
  },
  RELIANCE: {
    symbol: "RELIANCE",
    companyName: "Reliance Industries Ltd.",
    exchange: "NSE",
    sector: "Energy / Retail / Telecom",
    price: 2980.4,
    changePct: "+3.40%",
    pe: 26.8,
    rsi: "49.5 (Neutral)",
    macd: "Consolidation Phase",
    dma50: "₹2,950.00",
    dma200: "₹2,820.00",
  },
  INFY: {
    symbol: "INFY",
    companyName: "Infosys Ltd.",
    exchange: "NSE",
    sector: "Technology / IT Services",
    price: 1602.4,
    changePct: "+0.55%",
    pe: 24.2,
    rsi: "58.1 (Neutral)",
    macd: "Bullish Crossover",
    dma50: "₹1,560.00",
    dma200: "₹1,480.00",
  },
  SBIN: {
    symbol: "SBIN",
    companyName: "State Bank of India",
    exchange: "NSE",
    sector: "Banking / Financials",
    price: 842.6,
    changePct: "+1.48%",
    pe: 11.2,
    rsi: "65.2 (Strong)",
    macd: "Bullish Breakout",
    dma50: "₹810.00",
    dma200: "₹745.50",
  },
};

/**
 * Generates unified Stock Knowledge Object for a given ticker symbol.
 *
 * @param {string} symbol - Stock symbol (e.g. "RELIANCE", "TCS")
 * @returns {Promise<object>} Structured stock knowledge JSON
 */
export async function getStockKnowledge(symbol) {
  if (!symbol) throw new Error("[stockKnowledge] Symbol is required.");

  const cleanSymbol = symbol.trim().toUpperCase();
  const meta = STOCK_METADATA[cleanSymbol] || {
    symbol: cleanSymbol,
    companyName: `${cleanSymbol} Corporation`,
    exchange: "NSE",
    sector: "General Market",
    price: 150.0,
    changePct: "+0.00%",
    pe: 20.0,
    rsi: "50.0 (Neutral)",
    macd: "Neutral",
    dma50: "145.00",
    dma200: "135.00",
  };

  // 1. Fetch Stock News & Sentiment
  let articles = [];
  try {
    articles = await getStockNewsService(cleanSymbol);
  } catch (err) {
    articles = [];
  }

  const heat = calculateMarketHeat(articles);

  // 2. Fetch Evidence-Grounded AI Price Explanation
  let explanation = { summary: "No news coverage available for price movement.", confidence: "Low", sources: [] };
  try {
    explanation = await explainPriceMovement(cleanSymbol, meta.changePct);
  } catch (err) {
    console.warn("[stockKnowledge] Explanation warning:", err.message);
  }

  return {
    symbol: cleanSymbol,
    companyName: meta.companyName,
    exchange: meta.exchange,
    sector: meta.sector,
    price: meta.price,
    changePct: meta.changePct,
    peRatio: meta.pe,
    technicalIndicators: {
      rsi: meta.rsi,
      macd: meta.macd,
      dma50: meta.dma50,
      dma200: meta.dma200,
    },
    sentiment: heat.sentiment,
    sentimentScore: heat.score,
    articlesCount: articles.length,
    articles,
    explanation,
    generatedAt: new Date().toISOString(),
  };
}

export default { getStockKnowledge };
