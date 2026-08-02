import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  modifyOrder,
  getPendingOrders,
  getOrderDashboard,
  getAnalytics
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.get("/dashboard", getOrderDashboard);
router.get("/analytics", getAnalytics);
router.post("/", createOrder);
router.get("/pending", getPendingOrders);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id", modifyOrder);
router.delete("/:id", cancelOrder);

export default router;
