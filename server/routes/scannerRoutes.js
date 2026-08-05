import express from "express";
import { getScannerResults } from "../controllers/scannerController.js";
import { protect } from "../middleware/authMiddleware.js";

import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.use(protect); // All scanner routes require authentication

// GET /api/scanner
router.get("/", cacheMiddleware(300), getScannerResults);

export default router;
