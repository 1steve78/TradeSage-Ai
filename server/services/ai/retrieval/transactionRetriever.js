import mongoose from "mongoose";
import Transaction from "../../../models/Transaction.js";

/**
 * Retrieves recent transaction history (up to limit, default 10).
 * 
 * @param {string} userId
 * @param {number} limit
 * @returns {Promise<Object>} { recentTransactions }
 */
export const getTransactionContext = async (userId, limit = 10) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected || !userId) {
    return { recentTransactions: [] };
  }

  const txDocs = await Transaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .maxTimeMS(2000)
    .lean();

  const recentTransactions = txDocs.map((tx) => ({
    type: tx.type,
    symbol: tx.symbol,
    companyName: tx.companyName,
    quantity: tx.quantity,
    price: tx.price,
    totalAmount: tx.totalAmount,
    status: tx.status,
    date: tx.createdAt ? new Date(tx.createdAt).toISOString().split("T")[0] : null,
  }));

  return { recentTransactions };
};

export default {
  getTransactionContext,
};
