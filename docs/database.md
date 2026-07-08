Design collections:

    users
    watchlists
    orders
    transactions
    portfolios
    holdings
    aiInsights

User
{
    _id,
    name,
    email,
    password,
    riskProfile,
    createdAt
}

Portfolio
{
    userId,
    cashBalance,
    totalValue,
    investedAmount,
    pnl,
    holdings:[]
}

Holdings
{
    symbol,
    quantity,
    averagePrice,
    currentPrice,
    pnl,
    sector
}

Orders
{
    userId,
    symbol,
    orderType,
    quantity,
    price,
    status,
    createdAt
}