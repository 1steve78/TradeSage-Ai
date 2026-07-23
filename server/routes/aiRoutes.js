import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMarketPulse,
  getInsightHistory,
  getAIStats,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/market-pulse", protect, getMarketPulse);
router.get("/history", protect, getInsightHistory);
router.get("/stats", protect, getAIStats);

export default router;
