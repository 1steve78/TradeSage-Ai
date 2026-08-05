import { getDashboard } from "../services/dashboard/dashboardService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * @desc    Get aggregated dashboard data
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardData = catchAsync(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    const forceRefresh = Boolean(req.query.forceRefresh === "true");

    if (!userId) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const dashboardData = await getDashboard(userId, forceRefresh);

    return res.status(200).json({
        success: true,
        data: dashboardData
    });
});

export default {
    getDashboardData
};
