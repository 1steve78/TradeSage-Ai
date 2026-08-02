import { getDashboard } from "../services/dashboard/dashboardService.js";

/**
 * @desc    Get aggregated dashboard data
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const forceRefresh = Boolean(req.query.forceRefresh === "true");

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const dashboardData = await getDashboard(userId, forceRefresh);

        return res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error("Error in getDashboardData controller:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard data",
        });
    }
};

export default {
    getDashboardData
};
