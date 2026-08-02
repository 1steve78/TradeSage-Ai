import mongoose from "mongoose";
import { executeMarketOrder } from "./executionEngine.js";
import { getCompanyProfile } from "../marketService.js";
import Order from "../../models/Order.js";

export const executeTriggeredOrder = async (orderId, currentPrice) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const order = await Order.findById(orderId).session(session);
        if (!order || order.status !== "PENDING") {
            await session.abortTransaction();
            return;
        }

        const profile = await getCompanyProfile(order.symbol);
        
        // Use existing market execution pipeline
        await executeMarketOrder(order, profile.name, currentPrice, session);
        
        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        console.error(`Failed to execute triggered order ${orderId}:`, err);
        await session.abortTransaction();
        session.endSession();
        
        // Mark as rejected if insufficient funds, etc.
        try {
            await Order.findByIdAndUpdate(orderId, { status: "REJECTED", reason: err.message });
        } catch (e) {}
    }
};
