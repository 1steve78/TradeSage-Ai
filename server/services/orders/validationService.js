import Portfolio from "../../models/Portfolio.js";
import { getCompanyProfile } from "../marketService.js";

export const validateOrder = async (userId, orderData, currentPrice) => {
  if (!orderData.symbol || !orderData.quantity || orderData.quantity <= 0) {
    return { valid: false, reason: "Invalid order parameters" };
  }

  const profile = await getCompanyProfile(orderData.symbol);
  if (!profile || !profile.name) {
    return { valid: false, reason: "Invalid symbol" };
  }

  const totalValue = currentPrice * orderData.quantity;
  const portfolio = await Portfolio.findOne({ user: userId });

  if (orderData.side === "BUY") {
    if (!portfolio || portfolio.cash < totalValue) {
      return { valid: false, reason: "Insufficient balance" };
    }
  } else if (orderData.side === "SELL") {
    if (!portfolio) {
      return { valid: false, reason: "You do not own this stock" };
    }
    const holding = portfolio.holdings.find(h => h.symbol === orderData.symbol);
    if (!holding || holding.quantity < orderData.quantity) {
      return { valid: false, reason: "Insufficient shares" };
    }
  }

  return { valid: true, reason: null, companyName: profile.name };
};
