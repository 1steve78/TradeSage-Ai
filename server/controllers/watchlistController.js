import {
  createWatchlist,
  getWatchlists,
  renameWatchlist,
  deleteWatchlist,
  addStock,
  removeStock,
} from "../services/watchlistService.js";

export const create = async (req, res) => {
  try {
    const watchlist = await createWatchlist(
      req.user._id,
      req.body.name
    );

    res.status(201).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const watchlists = await getWatchlists(req.user._id);

    res.status(200).json({
      success: true,
      data: watchlists,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rename = async (req, res) => {
  try {
    const watchlist = await renameWatchlist(
      req.user._id,
      req.params.id,
      req.body.name
    );

    res.status(200).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteWatchlist(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Watchlist deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const add = async (req, res) => {
  try {
    const watchlist = await addStock(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeStockFromWatchlist = async (req, res) => {
  try {
    const watchlist = await removeStock(
      req.user._id,
      req.params.id,
      req.params.symbol
    );
        
    res.status(200).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};