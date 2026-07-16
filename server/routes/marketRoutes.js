import express from "express";
import { search } from "../controllers/marketController.js";
import { getStockHistory } from "../controllers/marketController.js";

const router = express.Router();

router.get('/search',search);
router.get('/:symbol/history',getStockHistory);

export default router;