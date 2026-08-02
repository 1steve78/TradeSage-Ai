import express from "express";
import { 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getPriceAlerts,
    createPriceAlert
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Notifications
router.get("/", getNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

// Alerts (Nested for simplicity)
router.route("/alerts")
    .get(getPriceAlerts)
    .post(createPriceAlert);

export default router;
