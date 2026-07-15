import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
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

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Transaction",
  transactionSchema
);