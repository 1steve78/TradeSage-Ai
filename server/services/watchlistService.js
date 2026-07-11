import Watchlist from "../models/Watchlist.js";

export const createWatchlist = async (userId,name) => {
    if(!name || !name.trim()){
        throw new Error("Watchlist name is required");
    }

    const watchlist = await Watchlist.create({
        userId,
        name : name.trim(),
        stocks:[],
    });
    
    return watchlist;
};

export const getWatchlists = async (userId) => {
    return await Watchlist.find({userId}).sort({
        createdAt : -1,
    });
};

export const renameWatchlist = async (
    userId,
    watchlistId,
    newName
)=>{
    if(!newName || !newName.trim()){
        throw new Error("Watchlist name is required");
    }

    const watchlist = await Watchlist.findOne({
        _id: watchlistId,
        userId,
    });

    if(!watchlist){
        throw new Error("Watchlist not found");
    }

    watchlist.name = newName.trim();

    await watchlist.save();

    return watchlist;
}

export const deleteWatchlist = async (
    userId,
    watchlistId
) => {
    const deleted = await Watchlist.findOneAndDelete({
        _id : watchlistId,
        userId,
    });

    if(!deleted){
        throw new Error("Watchlist not found");
    }

    return deleted;
}

export const addStock = async(
    userId ,
    watchlistId,
    stock
) => {
    const watchlist = await Watchlist.findOne({
        _id:watchlistId,
        userId,
    });

    if(!watchlist){
        throw new Error("Watchlist not found");
    }

    const exists = watchlist.stocks.some(
        (item) => item.symbol === stock.symbol
    );

    if(exists){
        throw new Error("Stock already exists in watchlist");
    }

    watchlist.stocks.push(stock);

    await watchlist.save();

    return watchlist;
}

export const removeStock = async (userId, watchlistId, symbol) => {
    const watchlist = await Watchlist.findOneAndUpdate(
        { _id: watchlistId, userId },
        { $pull: { stocks: { symbol: symbol } } },
        { new: true }
    );

    if(!watchlist){
        throw new Error("Watchlist not found");
    }

    return watchlist;
};