import { updateManyPrices, updatePrice } from "./marketPriceCache.js";

const prices = {
  AAPL: 212.5,
  MSFT: 518.3,
  NVDA: 182.6,
  TSLA: 301.2,
  GOOGL: 178.45,
  AMZN: 226.9,
  BTC: 67284.10,
};


const randomChange = () => {
  return (Math.random() - 0.5) * 2;
};

export const generatePrices = () => {
  for (const symbol in prices) {
    prices[symbol] += randomChange();

    prices[symbol] = Number(
      prices[symbol].toFixed(2)
    );
  }

  const priceList = Object.entries(prices).map(
    ([symbol, price]) => ({
      symbol,
      price,
      timestamp: Date.now(),
    })
  );
  updateManyPrices(priceList);
  return priceList;
};

export const generateSinglePriceUpdate = () => {
  const symbols = Object.keys(prices);
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

  prices[randomSymbol] += randomChange();
  prices[randomSymbol] = Number(prices[randomSymbol].toFixed(2));

  const updatedData = {
    symbol: randomSymbol,
    price: prices[randomSymbol],
    timestamp: Date.now(),
  };

  updatePrice(randomSymbol, updatedData);

  return updatedData;
};