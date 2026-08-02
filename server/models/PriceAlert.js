import mongoose from "mongoose";

const priceAlertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        condition: {
            type: String,
            enum: [">", "<", ">=", "<="],
            required: true,
        },
        target: {
            type: Number,
            required: true,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        triggered: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("PriceAlert", priceAlertSchema);
