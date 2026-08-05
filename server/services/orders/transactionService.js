import Transaction from "../../models/Transaction.js";

export const recordTransaction = async (transactionData, session) => {
  // transactionData should contain: user, orderId, symbol, companyName, price, quantity, side, totalAmount
  const newTransaction = await Transaction.create([{
    user: transactionData.user,
    orderId: transactionData.orderId,
    symbol: transactionData.symbol,
    companyName: transactionData.companyName,
    type: transactionData.side,
    quantity: transactionData.quantity,
    price: transactionData.price,
    totalAmount: transactionData.totalAmount,
    status: "SUCCESS"
  }], session ? { session } : undefined);

  return newTransaction[0];
};
