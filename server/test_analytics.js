import mongoose from "mongoose";
import { calculatePortfolioSummary, calculateAllocation, calculateSectorDistribution, calculatePerformance } from "./services/analytics/analyticsService.js";

async function test() {
    try {
        await mongoose.connect("mongodb+srv://steveyasin243_db_user:uQnRX7B3BgCrwhuo@tradesage-ai.jmuve3j.mongodb.net/?appName=TradeSage-Ai");

        console.log("Connected to MongoDB");

        // get the first user
        const User = (await import("./models/User.js")).default;
        const user = await User.findOne();

        if (!user) {
            console.log("No user found.");
            process.exit(0);
        }

        console.log("Testing with user:", user._id);

        const summary = await calculatePortfolioSummary(user._id);
        console.log("Summary success");

        const allocation = await calculateAllocation(user._id);
        console.log("Allocation success");

        const sectors = await calculateSectorDistribution(user._id);
        console.log("Sectors success");

        const performance = await calculatePerformance(user._id);
        console.log("Performance success");

        console.log("All successful!");

    } catch(err) {
        console.error("Test failed:", err);
    } finally {
        mongoose.disconnect();
    }
}

test();
