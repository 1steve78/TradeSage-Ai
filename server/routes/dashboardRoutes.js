import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All dashboard routes require authentication

// GET /api/dashboard
router.get("/", getDashboardData);

export default router;
