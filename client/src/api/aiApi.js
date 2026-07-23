import api from "./axios";

export const generateMarketPulse = async () => {
  const response = await api.post("/ai/market-pulse");
  return response.data;
};

export const getInsightHistory = async () => {
  const response = await api.get("/ai/history");
  return response.data;
};

export default {
  generateMarketPulse,
  getInsightHistory,
};
