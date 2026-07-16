import express from "express";
import { buy, sell } from "../controllers/tradingController.js";

// 1. Import the specific 'protect' function using curly braces
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 2. Replace 'authMiddleware' with 'protect' in your routes
router.post(
  "/buy",
  protect,
  buy
);

router.post(
  "/sell",
  protect,
  sell
);

export default router;