import express from "express";
import { search, getStockHistory, getQuote, getDepth, getOptions, getCompanyInfo, getMarketMoversData } from "../controllers/marketController.js";

import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.get('/search', search);
router.get('/movers', cacheMiddleware(120), getMarketMoversData);
router.get('/quote', getQuote);
router.get('/depth', getDepth);
router.get('/options', getOptions);
router.get('/:symbol/history', getStockHistory);
router.get('/:symbol/company', getCompanyInfo);

export default router;