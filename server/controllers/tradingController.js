import {
  buyStock,
  sellStock,
} from "../services/tradingService.js";

export const buy = async (req, res) => {
  try {
    const portfolio =
      await buyStock(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Stock purchased successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const sell = async (req, res) => {
  try {
    const portfolio =
      await sellStock(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Stock sold successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};