import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    sector: {
      type: String,
      trim: true,
      default: "Unknown"
    },

    industry: {
      type: String,
      trim: true,
      default: "Unknown"
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    averagePrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    cash: {
      type: Number,
      default: 1000000,
      min: 0,
    },

    holdings: {
      type: [holdingSchema],
      default: [],
    },

    investedValue: {
      type: Number,
      default: 0,
    },

    totalValue: {
      type: Number,
      default: 1000000,
    },

    totalPnL: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Portfolio",
  portfolioSchema
);