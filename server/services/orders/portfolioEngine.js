import Portfolio from "../../models/Portfolio.js";
import { getCurrentPrice } from "../marketPriceCache.js";

// Helper Function: Calculate new average price
const calculateAveragePrice = (currentQty, currentAvg, newQty, newPrice) => {
    const totalShares = currentQty + newQty;
    return Number(
        ((currentQty * currentAvg) + (newQty * newPrice)) / totalShares
    ).toFixed(2);
};

// Helper Function: Recalculate Portfolio metrics
const recalculateMetrics = (portfolio) => {
    let totalHoldingsCost = 0;
    let totalHoldingsMarketValue = 0;

    portfolio.holdings.forEach(h => {
        const market = getCurrentPrice(h.symbol);
        const livePrice = market ? market.price : h.averagePrice;
        
        totalHoldingsCost += h.averagePrice * h.quantity;
        totalHoldingsMarketValue += livePrice * h.quantity;
    });

    portfolio.investedValue = Number(totalHoldingsCost.toFixed(2));
    portfolio.totalValue = Number((portfolio.cash + totalHoldingsMarketValue).toFixed(2));
};

export const updatePortfolioForExecution = async (userId, symbol, companyName, quantity, price, side, session) => {
  let portfolio = await Portfolio.findOne({ user: userId }).session(session);
  if (!portfolio) {
    portfolio = await Portfolio.create([{ user: userId }], { session });
    portfolio = portfolio[0];
  }

  const totalValue = price * quantity;

  if (side === "BUY") {
    // Check Balance
    if (portfolio.cash < totalValue) {
        throw new Error("Insufficient balance");
    }

    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (holding) {
        holding.averagePrice = calculateAveragePrice(
            holding.quantity,
            holding.averagePrice,
            quantity,
            price
        );
        holding.quantity += quantity;
    } else {
        portfolio.holdings.push({
            symbol,
            companyName,
            quantity,
            averagePrice: price,
            exchange: "NSE", // Defaulting to NSE
        });
    }

    portfolio.cash = Number((portfolio.cash - totalValue).toFixed(2));

  } else if (side === "SELL") {
    const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
    if (holdingIndex === -1) {
        throw new Error("You do not own this stock");
    }

    const holding = portfolio.holdings[holdingIndex];
    if (holding.quantity < quantity) {
        throw new Error("Insufficient shares");
    }

    const realizedPnLContribution = (price - holding.averagePrice) * quantity;
    portfolio.totalPnL = Number((portfolio.totalPnL + realizedPnLContribution).toFixed(2));

    portfolio.cash = Number((portfolio.cash + totalValue).toFixed(2));
    holding.quantity -= quantity;

    if (holding.quantity === 0) {
        portfolio.holdings.splice(holdingIndex, 1);
    }
  }

  recalculateMetrics(portfolio);
  await portfolio.save({ session });
  
  return portfolio;
};
