import { getCachedDashboard, setCachedDashboard } from "./dashboardCache.js";
import {
    buildPortfolioWidget,
    buildAnalyticsWidget,
    buildWatchlistWidget,
    buildNewsWidget,
    buildMarketWidget,
    buildRecentActivityWidget,
    buildNotificationsWidget,
    buildAIWidget
} from "./widgetService.js";
import { getPreferences } from "./preferenceService.js";
import { generateMorningBrief } from "../ai/morningBriefService.js";

/**
 * Aggregates all dashboard data into a single massive JSON response.
 * Utilizes caching to prevent hammering backend services on every load.
 * 
 * @param {string} userId - User ID
 * @param {boolean} forceRefresh - If true, ignores cache
 */
export const getDashboard = async (userId, forceRefresh = false) => {
    // 1. Check Cache
    if (!forceRefresh) {
        const cached = getCachedDashboard(userId);
        if (cached) {
            return {
                ...cached,
                _source: "cache"
            };
        }
    }

    // 2. Fetch everything concurrently
    // We use Promise.allSettled or Promise.all to fetch in parallel.
    // Using Promise.all here because widgetService handles its own errors gracefully 
    // and returns fallback values (e.g., empty arrays/objects) instead of throwing.
    const [
        portfolio,
        analytics,
        watchlist,
        news,
        market,
        recentActivity,
        notifications,
        ai,
        preferences
    ] = await Promise.all([
        buildPortfolioWidget(userId),
        buildAnalyticsWidget(userId),
        buildWatchlistWidget(userId),
        buildNewsWidget(),
        buildMarketWidget(),
        buildRecentActivityWidget(userId),
        buildNotificationsWidget(userId),
        buildAIWidget(userId),
        getPreferences(userId)
    ]);

    // 2.5 Generate Morning Brief using fetched context
    const morningBrief = await generateMorningBrief(userId, portfolio, market);

    // 3. Assemble Payload
    const payload = {
        portfolio,
        analytics,
        watchlist,
        news,
        market,
        recentActivity,
        notifications,
        ai,
        preferences,
        morningBrief
    };

    // 4. Update Cache
    setCachedDashboard(userId, payload);

    return {
        ...payload,
        _source: "live"
    };
};
