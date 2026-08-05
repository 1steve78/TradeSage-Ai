import { createQueue } from "../bullmq.js";
import { generateMorningBrief } from "../../services/ai/morningBriefService.js";
import User from "../../models/User.js";
import { buildPortfolioWidget, buildMarketWidget } from "../../services/dashboard/widgetService.js";
import logger from "../logger.js";
import redisClient from "../redis.js";

const handler = async (job) => {
    logger.info(`Starting Morning Brief Job`);
    try {
        const users = await User.find({}).select('_id').lean();
        
        for (const user of users) {
            try {
                const portfolio = await buildPortfolioWidget(user._id);
                const market = await buildMarketWidget();
                
                const brief = await generateMorningBrief(user._id, portfolio, market);
                
                // Cache the brief for this user
                const cacheKey = `morning_brief:${user._id}`;
                await redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(brief)); // Cache for 1 hour
            } catch (err) {
                logger.error(`Failed to generate brief for user ${user._id}: ${err.message}`);
            }
        }
    } catch (error) {
        logger.error(`Morning Brief Job failed: ${error.message}`);
        throw error;
    }
};

export const morningBriefQueue = createQueue("MorningBriefQueue", handler);

// Function to schedule it
export const scheduleMorningBrief = async () => {
    // Run every day at 8:00 AM
    await morningBriefQueue.queue.add("generate-briefs", {}, {
        repeat: {
            pattern: "0 8 * * *"
        }
    });
};
