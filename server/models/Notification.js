import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["PRICE_ALERT", "ORDER", "AI", "NEWS", "SYSTEM", "PORTFOLIO"],
            required: true,
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Notification", notificationSchema);
