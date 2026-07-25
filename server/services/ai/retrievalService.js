import { retrieveForQuestion } from "./retrieval/masterRetrievalService.js";
import { getPortfolioContext } from "./retrieval/portfolioRetriever.js";
import { getAnalyticsContext } from "./retrieval/analyticsRetriever.js";
import { getTransactionContext } from "./retrieval/transactionRetriever.js";
import { getWatchlistContext } from "./retrieval/watchlistRetriever.js";
import { getConversationContext } from "./retrieval/conversationRetriever.js";
import { classifyQuestion } from "./retrieval/questionClassifier.js";
import { buildOptimizedContext } from "./retrieval/contextBuilder.js";

/**
 * Keys to strip out from context object to ensure sensitive/internal database identifiers 
 * are never passed to the LLM.
 */
const SENSITIVE_KEYS = new Set([
  "_id",
  "id",
  "__v",
  "user",
  "userId",
  "password",
  "email",
  "jwt",
  "token",
  "refreshToken",
  "createdAt",
  "updatedAt",
  "internalFields",
]);

/**
 * Recursively cleans an object or array by stripping sensitive DB keys.
 * @param {any} data - Data to clean
 * @returns {any} Cleaned data
 */
export const cleanPortfolioContext = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => cleanPortfolioContext(item));
  }

  if (typeof data === "object" && !(data instanceof Date)) {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYS.has(key)) {
        continue;
      }
      cleaned[key] = cleanPortfolioContext(value);
    }
    return cleaned;
  }

  return data;
};

export {
  retrieveForQuestion,
  getPortfolioContext,
  getAnalyticsContext,
  getTransactionContext,
  getWatchlistContext,
  getConversationContext,
  classifyQuestion,
  buildOptimizedContext,
};

export default {
  cleanPortfolioContext,
  retrieveForQuestion,
  getPortfolioContext,
  getAnalyticsContext,
  getTransactionContext,
  getWatchlistContext,
  getConversationContext,
  classifyQuestion,
  buildOptimizedContext,
};
