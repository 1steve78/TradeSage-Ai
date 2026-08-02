import Notification from "../../models/Notification.js";
import eventEngine, { EVENTS } from "./eventEngine.js";
import { getIO } from "../../sockets/socketHandler.js";

/**
 * Handles saving notifications to DB and pushing via Socket.IO
 */
const handleNotificationEvent = async (payload) => {
    try {
        const { userId, title, message, type, priority = "MEDIUM", metadata = {} } = payload;
        
        if (!userId) {
            console.error("Missing userId in notification payload");
            return;
        }

        // 1. Save to MongoDB
        const newNotification = await Notification.create({
            user: userId,
            title,
            message,
            type,
            priority,
            metadata
        });

        // 2. Push via Socket.IO
        const io = getIO();
        if (io) {
            // Assume users join a room with their userId
            io.to(`user_${userId}`).emit("NOTIFICATION_CREATED", newNotification);
        }

    } catch (error) {
        console.error("Failed to process notification event:", error);
    }
};

// Map business events to generic notifications
eventEngine.on(EVENTS.ORDER_EXECUTED, async (payload) => {
    const { userId, order } = payload;
    handleNotificationEvent({
        userId,
        title: "Order Executed",
        message: `Your ${order.type} order for ${order.quantity} shares of ${order.symbol} at ₹${order.price} has been filled.`,
        type: "ORDER",
        priority: "HIGH",
        metadata: { symbol: order.symbol, orderId: order._id }
    });
});

eventEngine.on(EVENTS.PRICE_ALERT_TRIGGERED, async (payload) => {
    const { userId, alert, currentPrice } = payload;
    handleNotificationEvent({
        userId,
        title: "Price Alert Triggered",
        message: `${alert.symbol} is now at ₹${currentPrice} (Condition: ${alert.condition} ₹${alert.target})`,
        type: "PRICE_ALERT",
        priority: "HIGH",
        metadata: { symbol: alert.symbol, currentPrice }
    });
});

eventEngine.on(EVENTS.AI_INSIGHT_READY, async (payload) => {
    const { userId, message } = payload;
    handleNotificationEvent({
        userId,
        title: "AI Insight Ready",
        message,
        type: "AI",
        priority: "MEDIUM"
    });
});

eventEngine.on(EVENTS.NEWS_UPDATE, async (payload) => {
    const { userId, symbol, headline } = payload;
    handleNotificationEvent({
        userId,
        title: `News Update: ${symbol}`,
        message: headline,
        type: "NEWS",
        priority: "LOW",
        metadata: { symbol }
    });
});

// We can also have a generic trigger if someone constructs the payload directly
eventEngine.on("GENERIC_NOTIFICATION", handleNotificationEvent);

console.log("Notification Service initialized.");
