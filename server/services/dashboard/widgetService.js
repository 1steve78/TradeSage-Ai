import { 
    calculatePortfolioSummary,
    calculateAllocation,
    calculateSectorDistribution,
    calculatePerformance
} from "../analytics/analyticsService.js";
import { getWatchlists } from "../watchlistService.js";
import { getMarketNews } from "../news/newsProvider.js";
import Transaction from "../../models/Transaction.js";
import { buildPortfolioContext } from "../ai/portfolioContextService.js";
import { calculateHealthScore } from "../ai/healthScoreService.js";
import { generateDailyInsight } from "../ai/insightGeneratorService.js";
import { searchStocks } from "../marketService.js"; // just to test it works

// 1. Portfolio Widget Builder
export const buildPortfolioWidget = async (userId) => {
    try {
        const summary = await calculatePortfolioSummary(userId);
        return summary || {};
    } catch (error) {
        console.error("[widgetService] Portfolio Error:", error.message);
        return {};
    }
};

// 2. Analytics Widget Builder
export const buildAnalyticsWidget = async (userId) => {
    try {
        const [allocation, sectorDist, performance] = await Promise.all([
            calculateAllocation(userId),
            calculateSectorDistribution(userId),
            calculatePerformance(userId)
        ]);

        return {
            allocation: allocation || [],
            sectorDistribution: sectorDist || [],
            performance: performance || { best: null, worst: null }
        };
    } catch (error) {
        console.error("[widgetService] Analytics Error:", error.message);
        return { allocation: [], sectorDistribution: [], performance: {} };
    }
};

// 3. Watchlist Widget Builder
export const buildWatchlistWidget = async (userId) => {
    try {
        // Find all watchlists and just return them
        const watchlists = await getWatchlists(userId);
        return watchlists || [];
    } catch (error) {
        console.error("[widgetService] Watchlist Error:", error.message);
        return [];
    }
};

// 4. News Widget Builder
export const buildNewsWidget = async () => {
    try {
        const news = await getMarketNews("general");
        return news.slice(0, 10); // Return top 10
    } catch (error) {
        console.error("[widgetService] News Error:", error.message);
        return [];
    }
};

// 5. Market Widget Builder
export const buildMarketWidget = async () => {
    try {
        // We will build a more robust market widget later, for now return basic status
        return {
            status: "OPEN", // Stub
            topGainers: [], // Stub
            topLosers: []   // Stub
        };
    } catch (error) {
        console.error("[widgetService] Market Error:", error.message);
        return {};
    }
};

// 6. Recent Activity Widget Builder
export const buildRecentActivityWidget = async (userId) => {
    try {
        const transactions = await Transaction.find({ user: userId })
            .select('symbol type quantity price totalAmount status createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        return transactions || [];
    } catch (error) {
        console.error("[widgetService] Recent Activity Error:", error.message);
        return [];
    }
};

// 7. Notifications Widget Builder
export const buildNotificationsWidget = async (userId) => {
    try {
        // Stub for Milestone 4
        return [];
    } catch (error) {
        return [];
    }
};

// 8. AI Widget Builder
export const buildAIWidget = async (userId) => {
    try {
        const context = await buildPortfolioContext(userId);
        const healthData = calculateHealthScore(context);
        const insightRes = await generateDailyInsight(userId, context, healthData, false);
        
        return {
            health: healthData,
            insight: insightRes.insight,
            cached: insightRes.cached,
            generatedAt: insightRes.timestamp
        };
    } catch (error) {
        console.error("[widgetService] AI Error:", error.message);
        return {};
    }
};
