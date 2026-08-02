import express from "express";
import { getUserPreferences, updateUserPreferences } from "../controllers/preferencesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getUserPreferences)
    .patch(updateUserPreferences);

export default router;
