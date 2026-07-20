import express from "express";
import { search, getStockHistory, getQuote, getDepth, getOptions, getCompanyInfo } from "../controllers/marketController.js";

const router = express.Router();

router.get('/search', search);
router.get('/quote', getQuote);
router.get('/depth', getDepth);
router.get('/options', getOptions);
router.get('/:symbol/history', getStockHistory);
router.get('/:symbol/company', getCompanyInfo);

export default router;