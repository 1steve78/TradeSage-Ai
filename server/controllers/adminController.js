import { metrics } from "../middleware/performanceMonitor.js";
import { getIO } from "../sockets/socketHandler.js";

/**
 * @desc    Get performance metrics
 * @route   GET /api/admin/performance
 * @access  Private (Admin)
 */
export const getPerformanceMetrics = async (req, res) => {
    try {
        const uptime = Math.floor((Date.now() - metrics.startTime) / 1000); // in seconds
        const memoryUsageData = process.memoryUsage();
        const memoryUsageMb = Math.round(memoryUsageData.heapUsed / 1024 / 1024) + " MB";
        
        const io = getIO();
        const connectedSockets = io && io.engine ? io.engine.clientsCount : 0;
        
        // Mock cache hit rate for now until we add Redis in Milestone 3
        const cacheHitRate = "N/A";

        return res.status(200).json({
            success: true,
            data: {
                uptime,
                memoryUsage: memoryUsageMb,
                connectedSockets,
                cacheHitRate,
                averageApiLatency: metrics.averageLatency > 0 ? `${metrics.averageLatency.toFixed(2)} ms` : "0 ms",
                totalRequests: metrics.totalRequests
            }
        });
    } catch (error) {
        console.error("Error in getPerformanceMetrics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load performance metrics",
        });
    }
};

export default {
    getPerformanceMetrics
};
