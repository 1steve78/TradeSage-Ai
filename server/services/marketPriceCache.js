const marketPrices = new Map();

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