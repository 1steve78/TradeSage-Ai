import redisClient from "../infrastructure/redis.js";
import logger from "../infrastructure/logger.js";

export const cacheMiddleware = (durationSeconds) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;
        
        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                return res.status(200).json({
                    ...JSON.parse(cachedData),
                    _source: "redis"
                });
            }

            // Wrap res.json to intercept and cache the response
            const originalJson = res.json;
            res.json = function (body) {
                // Restore original json method to prevent recursive loops
                res.json = originalJson;
                
                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redisClient.setEx(key, durationSeconds, JSON.stringify(body)).catch(err => {
                        logger.error(`Redis SetEx Error for key ${key}: ${err.message}`);
                    });
                }
                
                return originalJson.call(this, body);
            };
            
            next();
        } catch (error) {
            logger.error(`Cache middleware error: ${error.message}`);
            // Fallback to normal flow if redis fails
            next();
        }
    };
};
