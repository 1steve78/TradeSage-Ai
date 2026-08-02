import { processOrder } from "../services/orders/orderService.js";
import Order from "../models/Order.js";
import Portfolio from "../models/Portfolio.js";

export const getOrderDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const [portfolio, orders] = await Promise.all([
      Portfolio.findOne({ user: userId }),
      Order.find({ userId }).sort({ createdAt: -1 })
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
          totalInvested: portfolio ? portfolio.totalInvested : 0,
          totalPnL: portfolio ? portfolio.totalPnL : 0
        },
        positions: holdings,
        pendingOrders,
        recentExecutions
      }
    });
  } catch (error) {
    console.error("Error in getOrderDashboard:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { getAnalytics: fetchAnalytics } = await import("../services/orders/analyticsService.js");
    const { getTimeline } = await import("../services/orders/timelineService.js");

    const [analytics, timeline] = await Promise.all([
      fetchAnalytics(req.user.id),
      getTimeline(req.user.id)
    ]);

    // Simple Performance Badges logic
    const badges = [];
    if (analytics.metrics.totalOrders >= 10) badges.push({ id: "active_trader", label: "Active Trader", icon: "🟢", desc: "10+ orders" });
    if (analytics.metrics.successRate > 60) badges.push({ id: "high_win_rate", label: "High Win Rate", icon: "🏆", desc: ">60% success" });
    // Assuming we don't have drawdown computed here easily, we'll just add one if volume is high
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
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body
    };

    const result = await processOrder(req.user.id, orderData);
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result.portfolio,
      order: result.order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id, status: "PENDING" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    
    if (order.status !== "PENDING") {
      return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
    }

    order.status = "CANCELLED";
    await order.save();

    const { removePendingOrder } = await import("../services/orders/pendingOrderService.js");
    removePendingOrder(order._id, order.symbol);

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const modifyOrder = async (req, res) => {
  try {
    const { quantity, requestedPrice, triggerPrice } = req.body;
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "PENDING") {
      return res.status(400).json({ success: false, message: "Only pending orders can be modified" });
    }

    if (quantity) order.quantity = quantity;
    if (requestedPrice) order.requestedPrice = requestedPrice;
    if (triggerPrice) order.triggerPrice = triggerPrice;
    
    await order.save();

    const { updatePendingOrder } = await import("../services/orders/pendingOrderService.js");
    updatePendingOrder(order);

    res.status(200).json({ success: true, message: "Order modified successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
