import Portfolio from "../../models/Portfolio.js"
import Transaction from "../../models/Transaction.js"

import { getCurrentPrice } from "../marketPriceCache.js"

export const calculatePortfolioSummary =async(userId)=>{

    const portfolio = await Portfolio.findOne({user: userId});

    if(!portfolio){
        throw new Error("portfolio not found");
    }

    let holdingsValue = 0;
    for(const holding of portfolio.holdings){
        const market = getCurrentPrice(holding.symbol);

        if(!market) continue;

        holdingsValue += market.price *holding.quantity;
    }

    let investedAmount = 0;
    for(const holding of portfolio.holdings){
        investedAmount += holding.averagePrice * holding.quantity;
    }

    const portfolioValue = portfolio.cash + holdingsValue;

    const overallPnL = holdingsValue - investedAmount;

    const roi = investedAmount === 0 ? 0 : (overallPnL/investedAmount)*100;

    const todaysPnL = 0;

    return {portfolioValue,holdingsValue,investedAmount,cash : portfolio.cash,overallPnL,todaysPnL,roi,};
};

export const calculateAllocation = async(userId) =>{
    const portfolio  = await Portfolio.findOne({user:userId});

    if(!portfolio){
        throw new Error("Portfolio not found");
    }

    let totalValue = 0;

    for(const holding of portfolio.holdings){
        const market = getCurrentPrice(holding.symbol);

        if(!market) continue;

        totalValue+= market.price * holding.quantity;

    }

    const allocation = [];

    for(const holding of portfolio.holdings){
        const market=  getCurrentPrice(holding.symbol);

        if(!market) continue;

        const value = market.price * holding.quantity;

        allocation.push({
            symbol: holding.symbol,
            companyName : holding.companyName ,
            quantity : holding.quantity,
            value,
            percentage : Number((value/totalValue)*100)
            .toFixed(2),
        });
    }

    allocation.sort((a,b)=>{
        return b.value - a.value;
    });

    return {
        totalValue,
        allocation
    };
};

export const calculateSectorDistribution = async (userId) => {
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
        throw new Error("Portfolio not found");
    }

    const sectorMap = {};
    let totalHoldingsValue = 0;

    for (const holding of portfolio.holdings) {
        const market = getCurrentPrice(holding.symbol);
        const price = market ? market.price : holding.averagePrice;
        const value = price * holding.quantity;
        const sector = holding.sector || "Unknown";

        sectorMap[sector] = (sectorMap[sector] || 0) + value;
        totalHoldingsValue += value;
    }

    const distribution = Object.keys(sectorMap).map((sector) => {
        const value = sectorMap[sector];
        const percentage = totalHoldingsValue > 0 
            ? Number(((value / totalHoldingsValue) * 100).toFixed(2)) 
            : 0;
        return { sector, value, percentage };
    });

    distribution.sort((a, b) => b.value - a.value);

    return {
        totalValue: totalHoldingsValue,
        distribution
    };
};

export const calculatePerformance = async (userId) => {
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
        throw new Error("Portfolio not found");
    }

    const holdingsPerformance = [];

    for (const holding of portfolio.holdings) {
        const market = getCurrentPrice(holding.symbol);
        const currentPrice = market ? market.price : holding.averagePrice;
        const invested = holding.averagePrice * holding.quantity;
        const currentValue = currentPrice * holding.quantity;
        const pnl = currentValue - invested;
        const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0;

        holdingsPerformance.push({
            symbol: holding.symbol,
            companyName: holding.companyName,
            quantity: holding.quantity,
            averagePrice: holding.averagePrice,
            currentPrice,
            invested,
            currentValue,
            pnl,
            pnlPercentage: Number(pnlPercentage.toFixed(2))
        });
    }

    holdingsPerformance.sort((a, b) => b.pnlPercentage - a.pnlPercentage);

    const bestPerformer = holdingsPerformance[0] || null;
    const worstPerformer = holdingsPerformance[holdingsPerformance.length - 1] || null;

    return {
        bestPerformer,
        worstPerformer,
        holdingsPerformance,
        statistics: {
            totalHoldings: holdingsPerformance.length
        }
    };
};