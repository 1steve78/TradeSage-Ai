import express from "express"
import { getAllocation, getSummary, getSectorDistribution, getDashboardData } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/analytics/summary", protect, getSummary);
router.get("/analytics/allocation", protect, getAllocation);
router.get("/analytics/sectors", protect, getSectorDistribution);
router.get("/analytics/dashboard", protect, getDashboardData);

export default router;