import Order from "../../models/Order.js";
import { getCompanyProfile } from "../marketService.js";
import { subscribeToStocks } from "../market/smartApiSocketService.js";

const pendingOrders = new Map(); // symbol -> [Order]

export const loadPendingOrders = async () => {
    try {
        const orders = await Order.find({ status: "PENDING" });
        for (const order of orders) {
            addOrderToMemory(order);
            const profile = await getCompanyProfile(order.symbol);
            if (profile && profile.token) {
                subscribeToStocks([{ token: profile.token, symbol: order.symbol }]);
            }
        }
        console.log(`[PendingOrderService] Loaded ${orders.length} pending orders into memory.`);
    } catch (err) {
        console.error("Failed to load pending orders", err);
    }
};

const addOrderToMemory = (order) => {
    if (!pendingOrders.has(order.symbol)) {
        pendingOrders.set(order.symbol, []);
    }
    const list = pendingOrders.get(order.symbol);
    // Avoid duplicates
    if (!list.find(o => o._id.toString() === order._id.toString())) {
        list.push(order);
    }
};

export const addPendingOrder = async (order) => {
    addOrderToMemory(order);
    const profile = await getCompanyProfile(order.symbol);
    if (profile && profile.token) {
        subscribeToStocks([{ token: profile.token, symbol: order.symbol }]);
    }
};

export const removePendingOrder = (orderId, symbol) => {
    if (pendingOrders.has(symbol)) {
        const list = pendingOrders.get(symbol);
        pendingOrders.set(symbol, list.filter(o => o._id.toString() !== orderId.toString()));
    }
};

export const updatePendingOrder = (order) => {
    removePendingOrder(order._id, order.symbol);
    addOrderToMemory(order);
};

export const getPendingOrdersForSymbol = (symbol) => {
    return pendingOrders.get(symbol) || [];
};
