import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system",
        },
        dashboardLayout: {
            type: [String],
            default: [
                "portfolio",
                "health",
                "chart",
                "watchlist",
                "marketHeat",
                "news",
                "movers",
                "activity"
            ],
        },
        hiddenWidgets: {
            type: [String],
            default: [],
        },
        favouriteSymbols: {
            type: [String],
            default: [],
        },
        defaultScannerFilters: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("UserPreferences", userPreferencesSchema);
