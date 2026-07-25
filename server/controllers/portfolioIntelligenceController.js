import { buildPortfolioContext } from "../services/ai/portfolioContextService.js";
import { calculateHealthScore } from "../services/ai/healthScoreService.js";
import { generateDailyInsight } from "../services/ai/insightGeneratorService.js";

/**
 * Retrieves Portfolio Intelligence metrics, Health Score, Risk Alerts, and Daily AI Insight.
 * @route GET /api/ai/intelligence
 */
export const getPortfolioIntelligence = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const forceRefresh = Boolean(req.query.forceRefresh === "true");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // 1. Fetch complete portfolio context
    const context = await buildPortfolioContext(userId);

    // 2. Compute 100% deterministic Health Score & Risk Alerts
    const healthData = calculateHealthScore(context);

    // 3. Generate or retrieve cached Daily AI Insight
    const insightRes = await generateDailyInsight(userId, context, healthData, forceRefresh);

    return res.status(200).json({
      success: true,
      data: {
        health: healthData,
        insight: insightRes.insight,
        cached: insightRes.cached,
        generatedAt: insightRes.timestamp,
      },
    });
  } catch (error) {
    console.error("Error in getPortfolioIntelligence controller:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to calculate portfolio intelligence right now.",
    });
  }
};

export default {
  getPortfolioIntelligence,
};
