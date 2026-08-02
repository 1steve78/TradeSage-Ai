import mongoose from "mongoose";
import { validateOrder } from "./validationService.js";
import { executeMarketOrder } from "./executionEngine.js";
import Order from "../../models/Order.js";
import { getCompanyProfile } from "../marketService.js";
import { getLTP } from "../smartApiService.js";
import { getCurrentPrice } from "../marketPriceCache.js";

export const processOrder = async (userId, orderData) => {
  // 1. Get current price
  let currentPrice = orderData.requestedPrice;
  if (!currentPrice || orderData.orderType === "MARKET") {
      const profile = await getCompanyProfile(orderData.symbol);
      try {
         const ltpData = await getLTP({ exchange: profile.exchange || "NSE", symboltoken: profile.token });
         currentPrice = ltpData.ltp;
      } catch (err) {
         // Fallback to cache
         const cache = getCurrentPrice(orderData.symbol);
         if (cache) currentPrice = cache.price;
      }
      if (!currentPrice) {
          throw new Error("Unable to fetch live price");
      }
  }

  // 2. Validate
  const validation = await validateOrder(userId, orderData, currentPrice);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      // 3. Create Order
      const order = new Order({
        ...orderData,
        userId,
        status: "PENDING"
      });
      await order.save({ session });

      let result;
      // 4. Execution Engine
      if (order.orderType === "MARKET") {
        result = await executeMarketOrder(order, validation.companyName, currentPrice, session);
      } else {
        // Limit / Stop loss will wait
        result = { order };
      }

      await session.commitTransaction();
      session.endSession();

      // Add to pending queue after successful transaction commit
      if (order.orderType !== "MARKET") {
          const { addPendingOrder } = await import("./pendingOrderService.js");
          addPendingOrder(order);
      }

      return result;
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
  }
};
