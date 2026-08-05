import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import catchAsync from "../utils/catchAsync.js";

export const getPortfolio = catchAsync(async (req, res) => {
  let portfolio = await Portfolio.findOne({ user: req.user.id }).lean();

  if (!portfolio) {
    portfolio = await Portfolio.create({ user: req.user.id });
  }

  res.json({
    success: true,
    data: portfolio,
  });
});

export const getTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: transactions,
  });
});
