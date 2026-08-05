import redisClient from "../../infrastructure/redis.js";
import logger from "../../infrastructure/logger.js";

// TTL: 15 seconds as per Milestone 3 requirements
const TTL_SECONDS = 15;

export const getCachedDashboard = async (userId) => {
    try {
        const data = await redisClient.get(`dashboard:${userId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error(`Error reading dashboard cache for user ${userId}: ${error.message}`);
        return null;
    }
};

export const setCachedDashboard = async (userId, data) => {
    try {
        await redisClient.setEx(`dashboard:${userId}`, TTL_SECONDS, JSON.stringify(data));
    } catch (error) {
        logger.error(`Error setting dashboard cache for user ${userId}: ${error.message}`);
    }
};

export const clearCache = async (userId) => {
    try {
        await redisClient.del(`dashboard:${userId}`);
    } catch (error) {
        logger.error(`Error clearing dashboard cache for user ${userId}: ${error.message}`);
    }
};
