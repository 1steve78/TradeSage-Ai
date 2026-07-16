const initialPrices = {
  AAPL: 212.5,
  MSFT: 518.3,
  NVDA: 182.6,
  TSLA: 301.2,
  GOOGL: 178.45,
  AMZN: 226.9,
  BTC: 67284.10,
};

const marketPrices = new Map(
  Object.entries(initialPrices).map(([symbol, price]) => [
    symbol,
    { symbol, price, timestamp: Date.now() }
  ])
);

export const updatePrice = (symbol,data)=>{
    marketPrices.set(symbol,data);
}

export const updateManyPrices = (prices)=>{
    prices.forEach((price)=>{
        marketPrices.set(price.symbol,price);
    });
};

export const getCurrentPrice = (symbol)=>{
    return marketPrices.get(symbol);
}

export const getAllPrices = () => {
    return Array.from(marketPrices.values());
};