import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    contextHash: {
      type: String,
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // Default 30 min
    },
  },
  { timestamps: true }
);

// Indexes
aiInsightSchema.index({ contextHash: 1, type: 1 });
aiInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB TTL index

const AIInsight = mongoose.model("AIInsight", aiInsightSchema);

export default AIInsight;