/**
 * Health Score Service for TradeSage AI.
 * 100% deterministic rule engine evaluating portfolio health across 5 pillars (20 points each).
 * 
 * Pillars:
 * 1. Diversification (Asset & Sector spread)
 * 2. Returns & ROI (Profitability)
 * 3. Cash Management (Optimal liquidity)
 * 4. Concentration Risk (Single position size)
 * 5. Trade Execution (Win rate & performance)
 * 
 * @param {Object} context - Sanitized portfolio context
 * @returns {Object} { score, rating, strengths, warnings, riskAlerts, pillarScores }
 */
export const calculateHealthScore = (context = {}) => {
  const portfolio = context.portfolio || {};
  const holdings = portfolio.holdings || context.holdings || [];
  const analytics = context.analytics || {};
  const cash = portfolio.cash || 0;
  const totalValue = portfolio.totalValue || cash;
  const roi = portfolio.roi || analytics.roi || 0;
  const holdingCount = holdings.length || portfolio.holdingCount || 0;
  const sectorDist = context.sectorDistribution || analytics.sectors || [];
  const tradingStats = analytics.tradingStats || {};

  const strengths = [];
  const warnings = [];
  const riskAlerts = [];

  let diversificationScore = 0;
  let returnsScore = 0;
  let cashScore = 0;
  let concentrationScore = 0;
  let executionScore = 0;

  // 1. Diversification Pillar (20 pts)
  const topSector = Array.isArray(sectorDist) && sectorDist.length > 0 ? sectorDist[0] : null;
  const topSectorPct = topSector ? Number(topSector.percentage || 0) : 0;

  if (holdingCount >= 4 && topSectorPct <= 45) {
    diversificationScore = 20;
    strengths.push(`Well-diversified across ${holdingCount} holdings and balanced sectors.`);
  } else if (holdingCount >= 2) {
    diversificationScore = 12;
    if (topSectorPct > 50) {
      warnings.push(`Sector exposure concentrated in ${topSector.sector} (${topSectorPct.toFixed(1)}%).`);
      riskAlerts.push({
        severity: topSectorPct >= 65 ? "high" : "medium",
        category: "Sector Risk",
        message: `${topSector.sector} sector accounts for ${topSectorPct.toFixed(1)}% of holdings.`,
      });
    }
  } else if (holdingCount === 1) {
    diversificationScore = 5;
    warnings.push("Portfolio holds only 1 active position.");
    riskAlerts.push({
      severity: "medium",
      category: "Diversification",
      message: "Single stock position detected. Adding positions improves resilience.",
    });
  } else {
    diversificationScore = 10;
  }

  // 2. Returns & ROI Pillar (20 pts)
  if (roi >= 10) {
    returnsScore = 20;
    strengths.push(`Strong profitability with +${roi.toFixed(2)}% overall ROI.`);
  } else if (roi > 0) {
    returnsScore = 15;
    strengths.push(`Positive portfolio ROI of +${roi.toFixed(2)}%.`);
  } else if (roi >= -5) {
    returnsScore = 10;
    warnings.push(`Minor unrealized loss (${roi.toFixed(2)}% ROI).`);
  } else {
    returnsScore = 0;
    warnings.push(`Unrealized portfolio loss of ${roi.toFixed(2)}% ROI.`);
    riskAlerts.push({
      severity: "high",
      category: "Performance",
      message: `Portfolio has an active loss of ${roi.toFixed(2)}% ROI. Review underperforming assets.`,
    });
  }

  // 3. Cash Management Pillar (20 pts)
  const cashRatio = totalValue > 0 ? (cash / totalValue) * 100 : 100;

  if (cashRatio >= 10 && cashRatio <= 35) {
    cashScore = 20;
    strengths.push(`Optimal cash reserve at ${cashRatio.toFixed(1)}% of total value.`);
  } else if ((cashRatio >= 5 && cashRatio < 10) || (cashRatio > 35 && cashRatio <= 55)) {
    cashScore = 12;
    if (cashRatio > 35) {
      warnings.push(`High cash allocation (${cashRatio.toFixed(1)}%) may create return drag.`);
    }
  } else if (cashRatio < 5 && holdingCount > 0) {
    cashScore = 5;
    warnings.push(`Low cash reserves (${cashRatio.toFixed(1)}%), limiting dip-buying capacity.`);
    riskAlerts.push({
      severity: "medium",
      category: "Liquidity",
      message: `Cash is at ${cashRatio.toFixed(1)}% of portfolio value, below recommended 10% liquidity buffer.`,
    });
  } else {
    cashScore = 10;
  }

  // 4. Concentration Risk Pillar (20 pts)
  if (holdings.length > 0 && totalValue > 0) {
    const totalHoldingsValue = holdings.reduce((sum, h) => sum + (h.value || h.currentValue || 0), 0);
    let maxShare = 0;
    let maxHoldingSymbol = "";

    for (const h of holdings) {
      const hVal = h.value || h.currentValue || 0;
      const share = totalHoldingsValue > 0 ? (hVal / totalHoldingsValue) * 100 : 0;
      if (share > maxShare) {
        maxShare = share;
        maxHoldingSymbol = h.symbol;
      }
    }

    if (maxShare < 35) {
      concentrationScore = 20;
      strengths.push(`Balanced single-position sizing (largest holding ${maxHoldingSymbol} < 35%).`);
    } else if (maxShare < 48) {
      concentrationScore = 12;
      warnings.push(`Position size for ${maxHoldingSymbol} is ${maxShare.toFixed(1)}% of stock holdings.`);
    } else {
      concentrationScore = 5;
      warnings.push(`High concentration risk: ${maxHoldingSymbol} represents ${maxShare.toFixed(1)}% of stock holdings.`);
      riskAlerts.push({
        severity: maxShare >= 60 ? "high" : "medium",
        category: "Concentration",
        message: `${maxHoldingSymbol} represents ${maxShare.toFixed(1)}% of equity holdings.`,
      });
    }
  } else {
    concentrationScore = 20;
  }

  // 5. Trade Execution Pillar (20 pts)
  const winRate = tradingStats.winRate ?? 50;

  if (winRate >= 60) {
    executionScore = 20;
    strengths.push(`High trade execution win rate of ${winRate.toFixed(1)}%.`);
  } else if (winRate >= 45) {
    executionScore = 15;
  } else {
    executionScore = 10;
    warnings.push(`Trade win rate is ${winRate.toFixed(1)}%. Consider tightening stop losses.`);
  }

  const rawTotalScore = diversificationScore + returnsScore + cashScore + concentrationScore + executionScore;
  const score = Math.max(0, Math.min(100, Math.round(rawTotalScore)));

  let rating = "Moderate";
  if (score >= 80) rating = "Excellent";
  else if (score >= 65) rating = "Good";
  else if (score >= 50) rating = "Moderate";
  else rating = "Needs Attention";

  return {
    score,
    rating,
    strengths,
    warnings,
    riskAlerts,
    pillarScores: {
      diversification: diversificationScore,
      returns: returnsScore,
      cashManagement: cashScore,
      concentration: concentrationScore,
      execution: executionScore,
    },
    calculatedAt: new Date().toISOString(),
  };
};

export default {
  calculateHealthScore,
};
