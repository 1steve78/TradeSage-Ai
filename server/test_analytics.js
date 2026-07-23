import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectMongo from "./config/database.js";
import { calculatePortfolioSummary, calculateAllocation, calculateSectorDistribution, calculatePerformance } from "./services/analytics/analyticsService.js";

async function test() {
    try {
        await connectMongo();

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
