import marketGraph from "../graphs/marketGraph.js";
import AIInsight from "../models/AIInsight.js";

/**
 * Generates or retrieves cached Market Pulse insights using LangGraph workflow
 * @route POST /api/ai/market-pulse
 */
export const getMarketPulse = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || null;
    const forceRefresh = Boolean(req.body?.forceRefresh || req.query?.forceRefresh);

    const result = await marketGraph.invoke({
      userId,
      type: "MARKET_PULSE",
      skipCache: forceRefresh,
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: result.response,
        generatedAt: new Date().toISOString(),
        cached: Boolean(result.fromCache),
      },
    });
  } catch (error) {
    console.error("AI Controller Error (getMarketPulse):", error);
    return res.status(500).json({
      success: false,
      message: "Unable to generate market insights.",
    });
  }
};

/**
 * Retrieves paginated AI insight history for the authenticated user
 * @route GET /api/ai/history
 */
export const getInsightHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = userId ? { userId } : {};

    const total = await AIInsight.countDocuments(query);
    const rawInsights = await AIInsight.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Sanitize response to omit internal fields (prompt, contextHash)
    const sanitizedData = rawInsights.map((item) => ({
      _id: item._id,
      type: item.type,
      summary: item.response,
      symbol: item.symbol || null,
      generatedAt: item.createdAt,
      expiresAt: item.expiresAt,
    }));

    return res.status(200).json({
      success: true,
      data: sanitizedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("AI Controller Error (getInsightHistory):", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch insight history.",
    });
  }
};

/**
 * Retrieves AI usage and cache performance statistics
 * @route GET /api/ai/stats
 */
export const getAIStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || null;
    const query = userId ? { userId } : {};

    const totalInsights = await AIInsight.countDocuments(query);

    // Grouping by contextHash to determine cache hits vs fresh generations
    const uniqueContextHashes = await AIInsight.distinct("contextHash", query);
    const freshGenerations = uniqueContextHashes.length;
    const cachedHits = Math.max(0, totalInsights - freshGenerations);
    const cacheHitRate = totalInsights > 0 ? Math.round((cachedHits / totalInsights) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalInsights,
        cachedResponses: cachedHits,
        freshResponses: freshGenerations,
        cacheHitRate,
      },
    });
  } catch (error) {
    console.error("AI Controller Error (getAIStats):", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch AI statistics.",
    });
  }
};

export default {
  getMarketPulse,
  getInsightHistory,
  getAIStats,
};
