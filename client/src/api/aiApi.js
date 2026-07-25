import api from "./axios";

export const generateMarketPulse = async () => {
  const response = await api.post("/ai/market-pulse");
  return response.data;
};

export const getInsightHistory = async () => {
  const response = await api.get("/ai/history");
  return response.data;
};

export const getPortfolioIntelligence = async (forceRefresh = false) => {
  const response = await api.get(`/ai/intelligence${forceRefresh ? "?forceRefresh=true" : ""}`);
  return response.data;
};

export const sendAIChat = async (question, type = "portfolio") => {
  const response = await api.post("/ai/chat", { type, question });
  return response.data;
};

export const getAIChatHistory = async () => {
  const response = await api.get("/ai/chat/history");
  return response.data;
};

export const clearAIChatHistory = async () => {
  const response = await api.delete("/ai/chat/history");
  return response.data;
};

export default {
  generateMarketPulse,
  getInsightHistory,
  getPortfolioIntelligence,
  sendAIChat,
  getAIChatHistory,
  clearAIChatHistory,
};
