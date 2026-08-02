import Order from "../../models/Order.js";
import Transaction from "../../models/Transaction.js";

export const getTimeline = async (userId) => {
    const [orders, transactions] = await Promise.all([
        Order.find({ userId }).sort({ createdAt: -1 }).limit(50),
        Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(50)
    ]);

    const timeline = [];

    orders.forEach(order => {
        // Order Creation
        timeline.push({
            id: `create_${order._id}`,
            type: "ORDER_CREATED",
            message: `Created ${order.orderType} ${order.side} for ${order.quantity} ${order.symbol}`,
            timestamp: order.createdAt,
            metadata: { symbol: order.symbol, side: order.side, status: order.status }
        });

        // Execution/Cancellation/Rejection
        if (order.status === "EXECUTED" || order.status === "COMPLETED") {
            let msg = `${order.side} EXECUTED`;
            if (order.orderType === "LIMIT") msg = "LIMIT FILLED";
            else if (order.orderType === "STOP_LOSS") msg = "STOP LOSS TRIGGERED";
            else if (order.orderType === "TAKE_PROFIT") msg = "TAKE PROFIT TRIGGERED";

            timeline.push({
                id: `exec_${order._id}`,
                type: "ORDER_EXECUTED",
                message: `${msg} for ${order.quantity} ${order.symbol} @ ₹${order.executedPrice?.toFixed(2)}`,
                timestamp: order.executedAt || order.updatedAt,
                metadata: { symbol: order.symbol, price: order.executedPrice }
            });
        } else if (order.status === "CANCELLED") {
            timeline.push({
                id: `cancel_${order._id}`,
                type: "ORDER_CANCELLED",
                message: `Cancelled ${order.orderType} ${order.side} for ${order.symbol}`,
                timestamp: order.updatedAt,
                metadata: { symbol: order.symbol }
            });
        } else if (order.status === "REJECTED") {
            timeline.push({
                id: `reject_${order._id}`,
                type: "ORDER_REJECTED",
                message: `Order Rejected: ${order.reason || "Validation failed"}`,
                timestamp: order.updatedAt,
                metadata: { symbol: order.symbol, reason: order.reason }
            });
        }
    });

    // Sort by timestamp descending
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return timeline.slice(0, 50); // Keep it to latest 50 events
};
