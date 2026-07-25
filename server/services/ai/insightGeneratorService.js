import { findCachedInsight, saveInsight } from "./cacheService.js";
import { generateNIMCompletion } from "./nimService.js";
import { generateContextHash } from "./contextService.js";

/**
 * Generates a concise (max 120 words) daily portfolio insight grounded in deterministic health data.
 * Caches insight by context hash to avoid redundant LLM executions.
 * 
 * @param {string} userId - User ID
 * @param {Object} context - Sanitized portfolio context
 * @param {Object} healthData - Output from healthScoreService
 * @param {boolean} forceRefresh - If true, bypasses cache
 * @returns {Promise<Object>} { insight, cached, timestamp }
 */
export const generateDailyInsight = async (userId, context = {}, healthData = {}, forceRefresh = false) => {
  const dateKey = new Date().toISOString().split("T")[0];
  const contextData = {
    date: dateKey,
    portfolio: context.portfolio,
    healthScore: healthData.score,
    holdingCount: context.portfolio?.holdingCount || 0,
  };

  const contextHash = generateContextHash(contextData);

  // 1. Check Cache unless forceRefresh is set
  if (!forceRefresh && userId) {
    const cachedDoc = await findCachedInsight(contextHash, "DAILY_INSIGHT");
    if (cachedDoc && cachedDoc.response) {
      return {
        insight: cachedDoc.response,
        cached: true,
        timestamp: cachedDoc.createdAt ? new Date(cachedDoc.createdAt).toISOString() : new Date().toISOString(),
      };
    }
  }

  // 2. Build Grounded Insight Prompt
  const prompt = `You are an AI investment manager for TradeSage AI.

=== DETERMINISTIC PORTFOLIO HEALTH ===
Health Score: ${healthData.score}/100 (${healthData.rating})
Strengths: ${healthData.strengths?.join("; ") || "None"}
Warnings: ${healthData.warnings?.join("; ") || "None"}
Holdings Summary: ${JSON.stringify(context.portfolio?.holdings?.map(h => ({ symbol: h.symbol, pnl: h.pnl, returnPercentage: h.returnPercentage })) || [])}
======================================

Task: Write a concise daily portfolio insight explaining today's status.
Rules:
- MAXIMUM 120 WORDS.
- Focus on top drivers of returns or key concentration risks.
- Keep tone professional, educational, and objective.
- Do NOT provide formal financial advice.`;

  // 3. Generate Completion via NIM
  let responseText = "";
  try {
    responseText = await generateNIMCompletion(prompt, { maxTokens: 250, temperature: 0.2 });
  } catch (err) {
    console.error("Error generating daily insight completion:", err);
    responseText = `Your portfolio health score is ${healthData.score}/100 (${healthData.rating}). ${healthData.strengths?.[0] || "Monitor your asset allocations regularly."}`;
  }

  // 4. Save to Cache
  if (userId && responseText) {
    await saveInsight({
      userId,
      type: "DAILY_INSIGHT",
      prompt,
      response: responseText,
      contextHash,
    });
  }

  return {
    insight: responseText,
    cached: false,
    timestamp: new Date().toISOString(),
  };
};

export default {
  generateDailyInsight,
};
