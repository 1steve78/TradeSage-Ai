import eventEngine, { EVENTS } from "../notification/eventEngine.js";
import Notification from "../../models/Notification.js";

export const emitOrderEvent = async (event, payload) => {
  // emit: ORDER_EXECUTED, ORDER_CANCELLED, STOPLOSS_TRIGGERED, LIMIT_FILLED
  eventEngine.emit(event, payload);

  // Also create a notification directly if needed, or rely on eventEngine listeners
  if (event === EVENTS.ORDER_EXECUTED) {
    const { userId, order } = payload;
    const actionText = order.type === "BUY" ? "Bought" : "Sold";
    await Notification.create({
      user: userId,
      type: "TRADE_EXECUTED",
      title: `Order Executed`,
      message: `${actionText} ${order.quantity} ${order.symbol} @ ₹${order.price}`,
      read: false
    });
  }
};
