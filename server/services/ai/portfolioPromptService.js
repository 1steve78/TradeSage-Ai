/**
 * System prompt for Portfolio AI Assistant
 */
export const PORTFOLIO_SYSTEM_PROMPT = `You are an AI investment assistant for TradeSage AI.

Use ONLY the supplied portfolio data and deterministic risk analysis.
Never invent holdings or prices.
Never recommend buying or selling specific stocks or assets.
If information is missing, clearly state that it is unavailable.
Explain the deterministic rule engine findings clearly when relevant.
Keep explanations concise, factual, and educational. Do not provide formal financial advice.`;

/**
 * Builds OpenAI / NIM chat completion messages array containing system prompt, 
 * sanitized context, risk analysis alerts, recent conversation history, and current question.
 * 
 * @param {Object} cleanContext - Sanitized portfolio context JSON
 * @param {string} question - Current user question
 * @param {Array<{role: string, content: string}>} history - Recent conversation history
 * @param {Object} riskAnalysis - Output from ruleEngineService
 * @returns {Array<{role: string, content: string}>} Formatted OpenAI message array
 */
export const buildPortfolioPrompt = (cleanContext, question, history = [], riskAnalysis = null) => {
  const contextString = JSON.stringify(cleanContext, null, 2);

  let riskString = "";
  if (riskAnalysis) {
    riskString = `\n=== DETERMINISTIC RISK ENGINE ANALYSIS ===
Health Score: ${riskAnalysis.healthScore}/100
Warnings: ${JSON.stringify(riskAnalysis.warnings || [], null, 2)}
Insights: ${JSON.stringify(riskAnalysis.insights || [], null, 2)}
==========================================`;
  }

  const systemContent = `${PORTFOLIO_SYSTEM_PROMPT}

=== USER PORTFOLIO CONTEXT ===
${contextString}
==============================${riskString}`;

  const messages = [{ role: "system", content: systemContent }];

  // Append up to last 5 conversation history items if available
  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-5);
    for (const item of recentHistory) {
      if (item.role && (item.content || item.message)) {
        messages.push({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content || item.message,
        });
      }
    }
  }

  // Append current user question
  messages.push({
    role: "user",
    content: question,
  });

  return messages;
};

export default {
  PORTFOLIO_SYSTEM_PROMPT,
  buildPortfolioPrompt,
};
