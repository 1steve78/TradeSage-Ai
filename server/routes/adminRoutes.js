import express from "express";
import { getPerformanceMetrics } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Depending on the role setup, you might want an admin check middleware here
// For now we just use protect
router.use(protect);

// GET /api/admin/performance
router.get("/performance", getPerformanceMetrics);

export default router;
