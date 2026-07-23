import OpenAI from "openai";
import aiConfig from "../../config/aiConfig.js";

const getOpenAIClient = () => {
  return new OpenAI({
    baseURL: aiConfig.baseURL,
    apiKey: aiConfig.apiKey || "dummy_key_for_initialization",
  });
};

/**
 * Generates completion using NVIDIA NIM API (OpenAI compatible)
 * @param {string|Array} promptOrMessages - Prompt text or OpenAI message array
 * @param {Object} options - Override parameters (temperature, maxTokens, model)
 * @returns {Promise<string>} Model response string
 */
export const generateNIMCompletion = async (promptOrMessages, options = {}) => {
  if (!aiConfig.apiKey) {
    throw new Error("NVIDIA_API_KEY is not defined in environment configuration.");
  }

  const openai = getOpenAIClient();

  const messages = typeof promptOrMessages === "string"
    ? [{ role: "user", content: promptOrMessages }]
    : promptOrMessages;

  const response = await openai.chat.completions.create({
    model: options.model || aiConfig.model,
    messages: messages,
    temperature: options.temperature ?? aiConfig.temperature,
    max_tokens: options.maxTokens ?? aiConfig.maxTokens,
  });

  return response.choices[0]?.message?.content || "";
};

export default {
  generateNIMCompletion,
};
