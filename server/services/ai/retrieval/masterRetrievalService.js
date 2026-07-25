import { getPortfolioContext } from "./portfolioRetriever.js";
import { getAnalyticsContext } from "./analyticsRetriever.js";
import { getTransactionContext } from "./transactionRetriever.js";
import { getWatchlistContext } from "./watchlistRetriever.js";
import { getConversationContext } from "./conversationRetriever.js";
import { classifyQuestion } from "./questionClassifier.js";
import { buildOptimizedContext } from "./contextBuilder.js";
import User from "../../../models/User.js";

/**
 * Master Selective Retrieval Engine (Mini RAG)
 * 
 * 1. Classifies user question into intent and required financial categories.
 * 2. Concurrently retrieves ONLY relevant data streams from database/cache.
 * 3. Builds a targeted, lightweight context payload.
 * 
 * @param {string} userId - User ID
 * @param {string} question - User question string
 * @returns {Promise<Object>} { intent, categories, context, history }
 */
export const retrieveForQuestion = async (userId, question = "") => {
  try {
    const { intent, categories } = classifyQuestion(question);
    const categorySet = new Set(categories);

    // Prepare retriever promises selectively
    const retrieverPromises = {};

    if (categorySet.has("PORTFOLIO")) {
      retrieverPromises.portfolio = getPortfolioContext(userId).catch((err) => {
        console.error("Error in getPortfolioContext:", err);
        return null;
      });
    }

    if (categorySet.has("PERFORMANCE") || categorySet.has("SECTOR")) {
      retrieverPromises.analytics = getAnalyticsContext(userId).catch((err) => {
        console.error("Error in getAnalyticsContext:", err);
        return null;
      });
    }

    if (categorySet.has("TRANSACTIONS")) {
      retrieverPromises.transactions = getTransactionContext(userId, 10).catch((err) => {
        console.error("Error in getTransactionContext:", err);
        return { recentTransactions: [] };
      });
    }

    if (categorySet.has("WATCHLIST")) {
      retrieverPromises.watchlists = getWatchlistContext(userId).catch((err) => {
        console.error("Error in getWatchlistContext:", err);
        return { watchlists: [] };
      });
    }

    if (categorySet.has("RISK")) {
      retrieverPromises.risk = User.findById(userId)
        .select("riskProfile")
        .lean()
        .then((u) => ({ riskProfile: u?.riskProfile || "Medium" }))
        .catch(() => ({ riskProfile: "Medium" }));
    }

    if (categorySet.has("CONVERSATION")) {
      retrieverPromises.conversation = getConversationContext(userId, 5).catch((err) => {
        console.error("Error in getConversationContext:", err);
        return { lastMessages: [] };
      });
    }

    // Resolve active retriever promises concurrently
    const keys = Object.keys(retrieverPromises);
    const resultsArray = await Promise.all(Object.values(retrieverPromises));

    const retrievedData = {};
    keys.forEach((key, index) => {
      retrievedData[key] = resultsArray[index];
    });

    // Build targeted context
    const cleanContext = buildOptimizedContext(categories, retrievedData);
    const history = retrievedData.conversation?.lastMessages || [];

    return {
      intent,
      categories,
      context: cleanContext,
      history,
    };
  } catch (error) {
    console.error("Error in Master Retrieval Engine (retrieveForQuestion):", error);
    throw error;
  }
};

export default {
  retrieveForQuestion,
};
