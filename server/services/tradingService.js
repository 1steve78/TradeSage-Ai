import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { getCurrentPrice } from "./marketPriceCache.js";

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

// ==========================================
// BUY STOCK LOGIC
// ==========================================
export const buyStock = async (userId, order) => {
    const { symbol, companyName, quantity } = order;

    // 1. Validation
    if (quantity <= 0) {
        throw new Error("Invalid quantity");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Fetch Portfolio (with self-healing fallback)
        let portfolio = await Portfolio.findOne({ user: userId }).session(session);
        if (!portfolio) {
            portfolio = await Portfolio.create([{ user: userId }], { session });
            portfolio = portfolio[0];
        }

        // 3. Fetch Current Market Price
        const market = getCurrentPrice(symbol);
        if (!market) {
            throw new Error("Market price unavailable");
        }

        const currentPrice = market.price;
        const totalCost = currentPrice * quantity;

        // 4. Check Balance
        if (portfolio.cash < totalCost) {
            throw new Error("Insufficient balance");
        }

        // 5. Existing Holding?
        const holding = portfolio.holdings.find(h => h.symbol === symbol);

        if (holding) {
            // Update existing
            holding.averagePrice = calculateAveragePrice(
                holding.quantity,
                holding.averagePrice,
                quantity,
                currentPrice
            );
            holding.quantity += quantity;
        } else {
            // Push new
            portfolio.holdings.push({
                symbol,
                companyName,
                quantity,
                averagePrice: currentPrice,
            });
        }

        // 6. Deduct Cash
        portfolio.cash = Number(
            (
                portfolio.cash - totalCost
            ).toFixed(2)
        );

        // Recalculate metrics before saving
        recalculateMetrics(portfolio);
        await portfolio.save({ session });

        // 7. Create Transaction
        await Transaction.create([{
            user: userId,
            symbol,
            companyName,
            type: "BUY",
            quantity,
            price: currentPrice,
            totalAmount: totalCost,
            status: "SUCCESS",
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return portfolio;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// ==========================================
// SELL STOCK LOGIC
// ==========================================
export const sellStock = async (userId, order) => {
    const { symbol, companyName, quantity } = order;

    // 1. Validation
    if (quantity <= 0) {
        throw new Error("Invalid quantity");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Fetch Portfolio (with self-healing fallback)
        let portfolio = await Portfolio.findOne({ user: userId }).session(session);
        if (!portfolio) {
            portfolio = await Portfolio.create([{ user: userId }], { session });
            portfolio = portfolio[0];
        }

        // 3. Own Stock?
        const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
        if (holdingIndex === -1) {
            throw new Error("You do not own this stock");
        }

        // 4. Enough Shares?
        const holding = portfolio.holdings[holdingIndex];
        if (holding.quantity < quantity) {
            throw new Error("Insufficient shares");
        }

        // 5. Current Market Price
        const market = getCurrentPrice(symbol);
        if (!market) {
            throw new Error("Market price unavailable");
        }

        const currentPrice = market.price;
        const totalRevenue = currentPrice * quantity;

        // Calculate realized profit/loss contribution
        const realizedPnLContribution = (currentPrice - holding.averagePrice) * quantity;
        portfolio.totalPnL = Number((portfolio.totalPnL + realizedPnLContribution).toFixed(2));

        // 6. Increase Cash & Decrease Quantity
        portfolio.cash = Number(
            (
                portfolio.cash +
                totalRevenue
            ).toFixed(2)
        );

        holding.quantity -= quantity;

        // 7. Quantity Zero? Remove Holding
        if (holding.quantity === 0) {
            portfolio.holdings.splice(holdingIndex, 1);
        }

        // Recalculate metrics before saving
        recalculateMetrics(portfolio);
        await portfolio.save({ session });

        // 8. Create Transaction
        await Transaction.create([{
            user: userId,
            symbol,
            companyName,
            type: "SELL",
            quantity,
            price: currentPrice,
            totalAmount: totalRevenue,
            status: "SUCCESS",
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return portfolio;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};