import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  handleAIChat,
  getChatHistory,
  clearChatHistory,
} from "../controllers/portfolioAIController.js";

const router = express.Router();

router.post("/chat", protect, handleAIChat);
router.get("/chat/history", protect, getChatHistory);
router.delete("/chat/history", protect, clearChatHistory);

export default router;
