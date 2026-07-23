import mongoose from "mongoose";
import AIInsight from "../../models/AIInsight.js";

// Defined Cache Policy TTLs in milliseconds
export const CACHE_TTL_POLICY = {
  MARKET_PULSE: 30 * 60 * 1000,      // 30 minutes
  PORTFOLIO_SUMMARY: 5 * 60 * 1000,  // 5 minutes
  NEWS: 15 * 60 * 1000,               // 15 minutes
  RISK: 60 * 60 * 1000,               // 60 minutes
  DEFAULT: 30 * 60 * 1000,            // 30 minutes default
};

/**
 * Calculates expiration date based on insight type
 * @param {string} type
 * @returns {Date} Expiration date
 */
export const getExpiryForType = (type) => {
  const ttl = CACHE_TTL_POLICY[type] || CACHE_TTL_POLICY.DEFAULT;
  return new Date(Date.now() + ttl);
};

/**
 * Finds cached non-expired AI Insight by contextHash and type
 * @param {string} contextHash - Hash of context object
 * @param {string} type - Insight type (e.g. 'MARKET_PULSE', 'PORTFOLIO_SUMMARY')
 * @returns {Promise<Object|null>} Cached AIInsight document or null
 */
export const findCachedInsight = async (contextHash, type) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return null;
    }

    const cached = await AIInsight.findOne({
      contextHash,
      type,
      expiresAt: { $gt: new Date() },
    })
      .maxTimeMS(2000)
      .exec();

    return cached;
  } catch (error) {
    console.error("Error finding cached AI insight:", error.message);
    return null;
  }
};

/**
 * Saves a new AI Insight into database cache with specific TTL policy
 * @param {Object} params
 * @returns {Promise<Object|null>} Created AIInsight document or null
 */
export const saveInsight = async ({
  userId = null,
  type,
  prompt,
  response,
  contextHash,
  symbol = null,
  expiresAt = null,
}) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return null;
    }

    const calculatedExpiresAt = expiresAt || getExpiryForType(type);

    const insight = new AIInsight({
      userId,
      type,
      prompt,
      response,
      contextHash,
      symbol,
      expiresAt: calculatedExpiresAt,
    });

    await insight.save();
    return insight;
  } catch (error) {
    console.error("Error saving AI insight:", error.message);
    return null;
  }
};

/**
 * Removes expired insights from database manually if needed
 * @returns {Promise<number>} Number of deleted records
 */
export const clearExpiredInsights = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return 0;
    }

    const result = await AIInsight.deleteMany({
      expiresAt: { $lte: new Date() },
    });
    return result.deletedCount;
  } catch (error) {
    console.error("Error clearing expired AI insights:", error.message);
    return 0;
  }
};

export default {
  CACHE_TTL_POLICY,
  getExpiryForType,
  findCachedInsight,
  saveInsight,
  clearExpiredInsights,
};
