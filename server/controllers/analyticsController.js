import { calculateAllocation, calculatePortfolioSummary, calculateSectorDistribution } from "../services/analytics/analyticsService.js"
import catchAsync from "../utils/catchAsync.js";

export { getDashboardData } from "./dashboardController.js";

export const getSummary = catchAsync(async (req, res) => {
    const data = await calculatePortfolioSummary(req.user.id);
    res.json({
        success: true,
        data,
    });
});

export const getAllocation = catchAsync(async (req, res) => {
    const data = await calculateAllocation(req.user.id);
    res.json({
        success: true,
        data,
    });
});

export const getSectorDistribution = catchAsync(async (req, res) => {
    const data = await calculateSectorDistribution(req.user.id);
    res.json({
        success: true,
        data,
    });
});