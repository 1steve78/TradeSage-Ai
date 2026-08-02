import { updatePortfolioForExecution } from "./portfolioEngine.js";
import { recordTransaction } from "./transactionService.js";
import { emitOrderEvent } from "./orderEventService.js";
import { EVENTS } from "../notification/eventEngine.js";

export const executeMarketOrder = async (order, companyName, currentPrice, session) => {
  // 1. Update Portfolio
  const portfolio = await updatePortfolioForExecution(
    order.userId,
    order.symbol,
    companyName,
    order.quantity,
    currentPrice,
    order.side,
    session
  );

  // 2. Create Transaction
  const transaction = await recordTransaction({
    user: order.userId,
    orderId: order._id,
    symbol: order.symbol,
    companyName: companyName,
    price: currentPrice,
    quantity: order.quantity,
    side: order.side,
    totalAmount: currentPrice * order.quantity
  }, session);

  // 3. Update Order
  order.executedPrice = currentPrice;
  order.status = "EXECUTED";
  order.executedAt = new Date();
  await order.save({ session });

  // 4. Emit Event
  await emitOrderEvent(EVENTS.ORDER_EXECUTED, {
    userId: order.userId,
    order: {
      symbol: order.symbol,
      type: order.side,
      quantity: order.quantity,
      price: currentPrice,
      _id: transaction._id
    }
  });

  return { order, portfolio, position: {} };
};

export const executeLimitOrder = async (order) => {
  return order;
};

export const executeStopLoss = async (order) => {
  return order;
};

export const executeTakeProfit = async (order) => {
  return order;
};

export const cancelOrder = async (order) => {
  return order;
};

export const modifyOrder = async (order, modifications) => {
  return order;
};
