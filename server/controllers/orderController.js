import { processOrder } from "../services/orders/orderService.js";
import Order from "../models/Order.js";
import Portfolio from "../models/Portfolio.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getOrderDashboard = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const [portfolio, orders] = await Promise.all([
    Portfolio.findOne({ user: userId }).lean(),
    Order.find({ userId }).sort({ createdAt: -1 }).lean()
  ]);

  const cash = portfolio ? portfolio.cash : 0;
  const holdings = portfolio ? portfolio.holdings : [];

  const pendingOrders = orders.filter(o => o.status === "PENDING");
  const recentExecutions = orders.filter(o => o.status !== "PENDING");

  res.status(200).json({
    success: true,
    data: {
      summary: {
        cash,
        totalInvested: portfolio ? portfolio.investedValue : 0,
        totalPnL: portfolio ? portfolio.totalPnL : 0
      },
      positions: holdings,
      pendingOrders,
      recentExecutions
    }
  });
});

export const getAnalytics = catchAsync(async (req, res) => {
  const { getAnalytics: fetchAnalytics } = await import("../services/orders/analyticsService.js");
  const { getTimeline } = await import("../services/orders/timelineService.js");

  const [analytics, timeline] = await Promise.all([
    fetchAnalytics(req.user.id),
    getTimeline(req.user.id)
  ]);

  const badges = [];
  if (analytics.metrics.totalOrders >= 10) badges.push({ id: "active_trader", label: "Active Trader", icon: "🟢", desc: "10+ orders" });
  if (analytics.metrics.successRate > 60) badges.push({ id: "high_win_rate", label: "High Win Rate", icon: "🏆", desc: ">60% success" });
  if (analytics.trading.totalVolume > 100000) badges.push({ id: "high_roller", label: "High Roller", icon: "💎", desc: "100k+ volume" });

  res.status(200).json({
    success: true,
    data: {
      metrics: analytics.metrics,
      tradingStats: analytics.trading,
      timeline,
      performance: { badges }
    }
  });
});

export const createOrder = catchAsync(async (req, res) => {
  const orderData = { ...req.body };
  try {
    const result = await processOrder(req.user.id, orderData);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result.portfolio,
      order: result.order
    });
  } catch (error) {
    throw new AppError(error.message, 400, "ORDER_FAILED");
  }
});

export const getOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id }).lean();
  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }
  res.status(200).json({ success: true, data: order });
});

export const getPendingOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id, status: "PENDING" }).sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: orders });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }
  
  if (order.status !== "PENDING") {
    throw new AppError("Only pending orders can be cancelled", 400, "INVALID_ORDER_STATE");
  }

  order.status = "CANCELLED";
  await order.save();

  const { removePendingOrder } = await import("../services/orders/pendingOrderService.js");
  removePendingOrder(order._id, order.symbol);

  res.status(200).json({ success: true, message: "Order cancelled successfully" });
});

export const modifyOrder = catchAsync(async (req, res) => {
  const { quantity, requestedPrice, triggerPrice } = req.body;
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }
  if (order.status !== "PENDING") {
    throw new AppError("Only pending orders can be modified", 400, "INVALID_ORDER_STATE");
  }

  if (quantity) order.quantity = quantity;
  if (requestedPrice) order.requestedPrice = requestedPrice;
  if (triggerPrice) order.triggerPrice = triggerPrice;
  
  await order.save();

  const { updatePendingOrder } = await import("../services/orders/pendingOrderService.js");
  updatePendingOrder(order);

  res.status(200).json({ success: true, message: "Order modified successfully", data: order });
});
