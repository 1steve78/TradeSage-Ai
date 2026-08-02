import { marketStream } from "../market/smartApiSocketService.js";
import { getPendingOrdersForSymbol, removePendingOrder } from "./pendingOrderService.js";
import { executeTriggeredOrder } from "./triggeredOrderService.js";

const evaluate = (order, currentPrice) => {
    switch (order.orderType) {
        case "LIMIT":
            if (order.side === "BUY") return currentPrice <= order.requestedPrice;
            if (order.side === "SELL") return currentPrice >= order.requestedPrice;
            break;
        case "STOP_LOSS":
            if (order.side === "SELL") return currentPrice <= order.triggerPrice;
            // Optionally support BUY stop loss in the future
            if (order.side === "BUY") return currentPrice >= order.triggerPrice;
            break;
        case "TAKE_PROFIT":
            if (order.side === "SELL") return currentPrice >= order.triggerPrice;
            // Optionally support BUY take profit in the future
            if (order.side === "BUY") return currentPrice <= order.triggerPrice;
            break;
        default:
            return false;
    }
    return false;
};

export const initializeTriggerEngine = () => {
    marketStream.on('price_update', (data) => {
        const { symbol, price } = data;
        const pendingOrders = getPendingOrdersForSymbol(symbol);
        
        if (pendingOrders.length === 0) return;

        pendingOrders.forEach(order => {
            if (evaluate(order, price)) {
                // Remove from queue so it's not triggered twice
                removePendingOrder(order._id, symbol);
                executeTriggeredOrder(order._id, price);
            }
        });
    });
    console.log("[TriggerEngine] Initialized multi-strategy order monitoring engine.");
};
