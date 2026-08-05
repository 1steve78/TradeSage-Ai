import OpenAI from "openai";
import aiConfig from "../../config/aiConfig.js";
import { aiConfig as globalAiConfig } from "../../config/ai.config.js";
import CircuitBreaker from "../../utils/circuitBreaker.js";

const nimCb = new CircuitBreaker("NVIDIA_NIM", globalAiConfig.circuitBreaker);

const getOpenAIClient = () => {
  return new OpenAI({
    baseURL: aiConfig.baseURL || "https://integrate.api.nvidia.com/v1",
    apiKey: aiConfig.apiKey || "dummy_key_for_initialization",
    timeout: 120000, // Prevent infinite hangs, but allow enough time for LLM generation
  });
};

/**
 * Generates completion using NVIDIA NIM API (OpenAI compatible)
 * @param {string|Array} promptOrMessages - Prompt text or OpenAI message array
 * @param {Object} options - Override parameters (temperature, maxTokens, model)
 * @returns {Promise<string>} Model response string
 */
export const generateNIMCompletion = async (promptOrMessages, options = {}) => {
  const hasValidKey = Boolean(aiConfig.apiKey && aiConfig.apiKey !== "dummy_key_for_initialization" && !aiConfig.apiKey.includes("your_"));

  if (!hasValidKey) {
    console.warn("⚠️ NVIDIA_API_KEY is not set. Generating deterministic fallback response.");
    
    // Extract last user message or prompt content for context
    let queryText = "";
    if (typeof promptOrMessages === "string") {
      queryText = promptOrMessages;
    } else if (Array.isArray(promptOrMessages) && promptOrMessages.length > 0) {
      const lastUserMsg = [...promptOrMessages].reverse().find((m) => m.role === "user");
      queryText = lastUserMsg?.content || "";
    }

    return `Based on your portfolio analysis, here is a summary of your account context:

1. **Portfolio Overview**: Your account has active holdings and available cash balance configured in TradeSage AI.
2. **Key Insight**: ${queryText ? `Regarding "${queryText}": ` : ""}Your portfolio metrics indicate active position monitoring.
3. **Risk & Health**: Maintain sector diversification and ensure position sizes align with your medium-term investment strategy.

*(Note: Connect your NVIDIA NIM API key in \`server/.env\` for live LLM inference.)*`;
  }

  try {
    const openai = getOpenAIClient();

    const messages = typeof promptOrMessages === "string"
      ? [{ role: "user", content: promptOrMessages }]
      : promptOrMessages;

    // Use Circuit Breaker to wrap the NIM completion call
    const response = await nimCb.fire(async () => {
      return await openai.chat.completions.create({
        model: options.model || aiConfig.model || "meta/llama-3.1-70b-instruct",
        messages: messages,
        temperature: options.temperature ?? aiConfig.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? aiConfig.maxTokens ?? 1024,
      });
    });

    return response.choices[0]?.message?.content || "No explanation returned by NVIDIA NIM.";
  } catch (error) {
    console.error("NVIDIA NIM Completion Error:", error.message);
    return `Unable to process live AI completion: ${error.message}. Please check your NVIDIA API configuration.`;
  }
};

export default {
  generateNIMCompletion,
};
