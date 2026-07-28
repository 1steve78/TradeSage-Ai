import { EVENTS } from "../constants/events.js";
import Watchlist from "../models/Watchlist.js";
import { 
    marketStream, 
    connectWebSocket, 
    subscribeToStocks, 
    unsubscribeFromStocks 
} from "../services/market/smartApiSocketService.js";
import { updatePrice } from "../services/marketPriceCache.js";

// Hardcoded NIFTY 50 defaults for the "global-market" dashboard ticker
const GLOBAL_MARKET_STOCKS = [
    { symbol: "RELIANCE", token: "2885", exchange: "NSE" },
    { symbol: "TCS", token: "11536", exchange: "NSE" },
    { symbol: "HDFCBANK", token: "1333", exchange: "NSE" },
    { symbol: "INFY", token: "1594", exchange: "NSE" },
    { symbol: "ICICIBANK", token: "4963", exchange: "NSE" },
    { symbol: "SBIN", token: "3045", exchange: "NSE" }
];

export const registerMarketEvents = (socket) => {
  console.log(`Market events ready for ${socket.id}`);

  // Handle joining specific rooms (e.g. watchlist IDs or global-market)
  socket.on(EVENTS.JOIN_ROOM, async (roomId) => {
    console.log(`Socket ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);
    
    // Subscribe to Angel One live data based on the room joined
    if (roomId === "global-market") {
        subscribeToStocks(GLOBAL_MARKET_STOCKS);
    } else {
        try {
            // Check if it's a valid watchlist room and subscribe to its stocks
            const watchlist = await Watchlist.findById(roomId);
            if (watchlist && watchlist.stocks.length > 0) {
                subscribeToStocks(watchlist.stocks);
            }
        } catch (error) {
            // Invalid ObjectId or not a watchlist, ignore
        }
    }
  });

  // Handle leaving specific rooms
  socket.on(EVENTS.LEAVE_ROOM, async (roomId) => {
    console.log(`Socket ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);
  });
};

export const startMarketBroadcast = async (io) => {
  // 1. Establish the persistent WebSocket connection with Angel One
  await connectWebSocket();
  
  // 2. Automatically subscribe to the global market tickers
  subscribeToStocks(GLOBAL_MARKET_STOCKS);

  // 3. Listen to the internal EventEmitter and broadcast to Socket.io clients
  marketStream.on('price_update', async (priceUpdate) => {
    try {
      // Save the live price into the cache for AI services to access
      updatePrice(priceUpdate.symbol, priceUpdate);

      // 1. Emit to global market tickers room
      io.to("global-market").emit(EVENTS.PRICE_UPDATE, priceUpdate);

      // 2. Find watchlists containing the updated stock symbol
      const watchlists = await Watchlist.find(
        { "stocks.symbol": priceUpdate.symbol },
        "_id"
      );

      // 3. Emit update only to sockets in those active watchlist rooms
      watchlists.forEach((watchlist) => {
        const roomId = watchlist._id.toString();
        io.to(roomId).emit(EVENTS.PRICE_UPDATE, priceUpdate);
      });
    } catch (error) {
      console.error("Error in startMarketBroadcast:", error);
    }
  });
};