/**
 * Rule Engine Service for TradeSage AI.
 * Performs deterministic financial calculations and risk analysis on portfolio context.
 * 
 * Rules Evaluated:
 * 1. Concentration Risk: Single holding value > 40% of holdings value
 * 2. Liquidity Warning: Cash balance < 5% of total portfolio value
 * 3. Cash Drag Warning: Cash balance > 60% of total portfolio value
 * 4. Negative ROI Warning: Portfolio ROI < 0 or negative PnL
 * 5. Diversification Alert: Total holdings <= 2 or sector concentration > 60%
 * 
 * @param {Object} context - Sanitized portfolio context
 * @returns {Object} { healthScore, warnings, insights }
 */
export const analyzePortfolioRules = (context = {}) => {
  const warnings = [];
  const insights = [];
  let healthScore = 100;

  const portfolio = context.portfolio || {};
  const holdings = portfolio.holdings || context.holdings || [];
  const cash = portfolio.cash || 0;
  const totalValue = portfolio.totalValue || cash;
  const totalPnL = portfolio.totalPnL || 0;
  const roi = portfolio.roi || 0;
  const holdingCount = holdings.length || portfolio.holdingCount || 0;

  // Rule 1: Concentration Risk Check
  if (totalValue > 0 && holdings.length > 0) {
    const totalHoldingsValue = holdings.reduce((sum, h) => sum + (h.value || h.currentValue || 0), 0);
    
    for (const h of holdings) {
      const hVal = h.value || h.currentValue || 0;
      const share = totalHoldingsValue > 0 ? (hVal / totalHoldingsValue) * 100 : 0;

      if (share >= 40) {
        healthScore -= 20;
        warnings.push({
          type: "CONCENTRATION_RISK",
          severity: share >= 55 ? "HIGH" : "MEDIUM",
          holding: h.symbol,
          companyName: h.companyName || h.symbol,
          sharePercentage: Number(share.toFixed(1)),
          message: `${h.companyName || h.symbol} (${h.symbol}) represents ${share.toFixed(1)}% of total stock holdings, indicating high concentration risk.`,
        });
      }
    }
  }

  // Rule 2: Liquidity Check (Cash < 5%)
  if (totalValue > 0) {
    const cashRatio = (cash / totalValue) * 100;

    if (cashRatio < 5 && holdingCount > 0) {
      healthScore -= 15;
      warnings.push({
        type: "LOW_LIQUIDITY",
        severity: "MEDIUM",
        cashRatio: Number(cashRatio.toFixed(1)),
        cashAmount: cash,
        message: `Available cash is ${cashRatio.toFixed(1)}% of total portfolio value (below 5% target), limiting liquidity for market opportunities.`,
      });
    } else if (cashRatio > 60) {
      healthScore -= 10;
      warnings.push({
        type: "CASH_DRAG",
        severity: "LOW",
        cashRatio: Number(cashRatio.toFixed(1)),
        cashAmount: cash,
        message: `Cash ratio is ${cashRatio.toFixed(1)}% of total portfolio value. High cash levels may cause return drag during market rallies.`,
      });
    } else {
      insights.push(`Cash balance is healthy at ${cashRatio.toFixed(1)}% of total portfolio value.`);
    }
  }

  // Rule 3: Negative Return / ROI Check
  if (totalPnL < 0 || roi < 0) {
    healthScore -= 15;
    warnings.push({
      type: "NEGATIVE_RETURN",
      severity: "MEDIUM",
      totalPnL,
      roi,
      message: `Portfolio has an unrealized loss of ₹${Math.abs(totalPnL).toLocaleString()} (${roi.toFixed(2)}% ROI).`,
    });
  } else if (roi > 10) {
    insights.push(`Strong portfolio performance with +${roi.toFixed(2)}% total ROI.`);
  }

  // Rule 4: Diversification Alert
  if (holdingCount === 0) {
    insights.push("Portfolio consists entirely of cash with no active equity holdings.");
  } else if (holdingCount <= 2) {
    healthScore -= 15;
    warnings.push({
      type: "POOR_DIVERSIFICATION",
      severity: "MEDIUM",
      holdingCount,
      message: `Portfolio contains only ${holdingCount} holding(s). Additional diversification across sectors is recommended.`,
    });
  }

  // Rule 5: Sector Concentration Check
  const sectorDist = context.sectorDistribution || context.analytics?.sectors || [];
  if (Array.isArray(sectorDist) && sectorDist.length > 0) {
    const topSector = sectorDist[0];
    const percentage = Number(topSector.percentage || 0);

    if (percentage >= 50) {
      healthScore -= 10;
      warnings.push({
        type: "SECTOR_CONCENTRATION",
        severity: "MEDIUM",
        sector: topSector.sector,
        percentage,
        message: `${topSector.sector} sector accounts for ${percentage.toFixed(1)}% of portfolio equity allocation.`,
      });
    }
  }

  // Ensure health score stays within 0-100 range
  healthScore = Math.max(0, Math.min(100, healthScore));

  return {
    healthScore,
    warnings,
    insights,
    analyzedAt: new Date().toISOString(),
  };
};

export default {
  analyzePortfolioRules,
};
