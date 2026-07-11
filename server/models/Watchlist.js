import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
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
  },
  {
    _id: false,
  }
);

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    stocks: {
      type: [stockSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Watchlist = mongoose.model(
  "Watchlist",
  watchlistSchema
);

export default Watchlist;