import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
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

    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT", "STOP_LOSS", "TAKE_PROFIT"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    requestedPrice: {
      type: Number,
      default: null,
    },

    executedPrice: {
      type: Number,
      default: null,
    },

    triggerPrice: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["PENDING", "EXECUTED", "COMPLETED", "CANCELLED", "REJECTED", "EXPIRED"],
      default: "PENDING",
    },

    reason: {
      type: String,
      default: null,
    },

    executedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);
