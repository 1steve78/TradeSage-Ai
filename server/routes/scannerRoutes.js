import express from "express";
import { getScannerResults } from "../controllers/scannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All scanner routes require authentication

// GET /api/scanner
router.get("/", getScannerResults);

export default router;
