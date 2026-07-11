import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  create,
  getAll,
  rename,
  remove,
  add,
  removeStockFromWatchlist,
} from "../controllers/watchlistController.js";

const router = express.Router();

router.post("/", protect, create);

router.get("/", protect, getAll);

router.patch("/:id", protect, rename);

router.delete("/:id", protect, remove);

router.post("/:id/stocks", protect, add);

router.delete(
  "/:id/stocks/:symbol",
  protect,
  removeStockFromWatchlist
);

export default router;