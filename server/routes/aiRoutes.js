import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMarketPulse,
  getInsightHistory,
  getAIStats,
} from "../controllers/aiController.js";
import {
  handleAIChat,
  getChatHistory,
  clearChatHistory,
} from "../controllers/portfolioAIController.js";
import { getPortfolioIntelligence } from "../controllers/portfolioIntelligenceController.js";

const router = express.Router();

// Portfolio Intelligence Engine (Health Score + Daily Insight + Risk Alerts)
router.get("/intelligence", protect, getPortfolioIntelligence);

// Portfolio RAG Chat Standardized Endpoint
router.post("/chat", protect, handleAIChat);
router.get("/chat/history", protect, getChatHistory);
router.delete("/chat/history", protect, clearChatHistory);

// Legacy AI Insights & Pulse
router.post("/market-pulse", protect, getMarketPulse);
router.get("/history", protect, getInsightHistory);
router.get("/stats", protect, getAIStats);

export default router;
