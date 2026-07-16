import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";

export const getPortfolio =
  async (req, res) => {
    try {
      let portfolio =
        await Portfolio.findOne({
          user: req.user.id,
        });

      if (!portfolio) {
        portfolio = await Portfolio.create({ user: req.user.id });
      }

      res.json({
        success: true,
        data: portfolio,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }

  };

  export const getTransactions =
  async (req, res) => {
    try {
      const transactions =
        await Transaction.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };



