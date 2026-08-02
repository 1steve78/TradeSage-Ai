import Order from "../../models/Order.js";
import Portfolio from "../../models/Portfolio.js";

export const getAnalytics = async (userId) => {
    // 1. Fetch data
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    const portfolio = await Portfolio.findOne({ user: userId });

    // 2. Order Metrics
    const metrics = {
        totalOrders: orders.length,
        executedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        rejectedOrders: 0,
        successRate: 0
    };

    let totalLatencyMs = 0;
    let filledCount = 0;
    
    // 3. Trading Metrics
    const trading = {
        totalBuyOrders: 0,
        totalSellOrders: 0,
        totalVolume: 0,
        averageOrderSize: 0,
        realizedPnL: portfolio ? portfolio.totalPnL : 0,
        unrealizedPnL: 0, // Calculated dynamically by frontend usually, but we leave placeholder
        averageLatencyMs: 0
    };

    orders.forEach(order => {
        // Status counts
        if (order.status === "EXECUTED" || order.status === "COMPLETED") metrics.executedOrders++;
        else if (order.status === "PENDING") metrics.pendingOrders++;
        else if (order.status === "CANCELLED") metrics.cancelledOrders++;
        else if (order.status === "REJECTED") metrics.rejectedOrders++;

        // Trading stats
        if (order.side === "BUY") trading.totalBuyOrders++;
        if (order.side === "SELL") trading.totalSellOrders++;

        if (order.status === "EXECUTED" || order.status === "COMPLETED") {
            trading.totalVolume += (order.executedPrice * order.quantity);
            
            // Latency calculation
            if (order.executedAt && order.createdAt) {
                totalLatencyMs += (new Date(order.executedAt).getTime() - new Date(order.createdAt).getTime());
                filledCount++;
            }
        }
    });

    if (metrics.totalOrders > 0) {
        metrics.successRate = ((metrics.executedOrders / metrics.totalOrders) * 100).toFixed(1);
    }
    
    if (filledCount > 0) {
        trading.averageLatencyMs = Math.round(totalLatencyMs / filledCount);
        trading.averageOrderSize = Math.round(trading.totalVolume / filledCount);
    }

    return { metrics, trading };
};
