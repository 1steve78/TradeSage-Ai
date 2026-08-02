import PriceAlert from "../../models/PriceAlert.js";
import eventEngine, { EVENTS } from "./eventEngine.js";

// Cache alerts in memory to avoid DB thrashing
let activeAlerts = [];

export const loadActiveAlerts = async () => {
    try {
        activeAlerts = await PriceAlert.find({ enabled: true, triggered: false });
        console.log(`[AlertEngine] Loaded ${activeAlerts.length} active price alerts.`);
    } catch (err) {
        console.error("Failed to load active alerts:", err);
    }
};

export const evaluateAlerts = async (pricesMap) => {
    if (!activeAlerts || activeAlerts.length === 0) return;

    for (const alert of activeAlerts) {
        const currentData = pricesMap[alert.symbol];
        if (!currentData || !currentData.price) continue;
        
        const currentPrice = currentData.price;
        let isTriggered = false;

        if (alert.condition === ">" && currentPrice > alert.target) isTriggered = true;
        if (alert.condition === ">=" && currentPrice >= alert.target) isTriggered = true;
        if (alert.condition === "<" && currentPrice < alert.target) isTriggered = true;
        if (alert.condition === "<=" && currentPrice <= alert.target) isTriggered = true;

        if (isTriggered) {
            console.log(`[AlertEngine] TRIGGERED: ${alert.symbol} @ ${currentPrice} (Target: ${alert.target})`);
            
            // Emit Event
            eventEngine.emit(EVENTS.PRICE_ALERT_TRIGGERED, {
                userId: alert.user,
                alert,
                currentPrice
            });

            // Update DB
            try {
                await PriceAlert.findByIdAndUpdate(alert._id, { triggered: true, enabled: false });
            } catch (err) {
                console.error("Failed to update PriceAlert status:", err);
            }
        }
    }

    // Remove triggered alerts from memory
    activeAlerts = activeAlerts.filter(a => !a.triggered);
};

// Expose a way to refresh alerts if a user adds a new one
export const refreshAlertsCache = () => {
    loadActiveAlerts();
};
