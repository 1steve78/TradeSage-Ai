import express from "express";

import {
  getPortfolio,
  getTransactions,
} from "../controllers/portfolioController.js";

import { protect } from "../middleware/authMiddleware.js";
import Portfolio from "../models/Portfolio.js";


const router =
  express.Router();

router.get(
  "/",
  protect,
  getPortfolio
);

router.get(
  "/transactions",
  protect,
  getTransactions
);

export default router;