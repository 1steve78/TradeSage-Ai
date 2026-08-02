import EventEmitter from "events";

class EventEngine extends EventEmitter {}

const eventEngine = new EventEngine();

// Increase max listeners if many modules subscribe
eventEngine.setMaxListeners(20);

// Event Types Constants
export const EVENTS = {
    NOTIFICATION_CREATED: "NOTIFICATION_CREATED",
    NOTIFICATION_READ: "NOTIFICATION_READ",
    PRICE_ALERT_TRIGGERED: "PRICE_ALERT_TRIGGERED",
    ORDER_EXECUTED: "ORDER_EXECUTED",
    AI_INSIGHT_READY: "AI_INSIGHT_READY",
    NEWS_UPDATE: "NEWS_UPDATE"
};

export default eventEngine;
