import { EVENTS } from "../constants/events.js";
import { generateSinglePriceUpdate } from "../services/mockMarketService.js";
import Watchlist from "../models/Watchlist.js";

export const registerMarketEvents = (socket) => {
  console.log(`Market events ready for ${socket.id}`);

  // Handle joining specific rooms (e.g. watchlist IDs or global-market)
  socket.on(EVENTS.JOIN_ROOM, (roomId) => {
    console.log(`Socket ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);
  });

  // Handle leaving specific rooms
  socket.on(EVENTS.LEAVE_ROOM, (roomId) => {
    console.log(`Socket ${socket.id} leaving room: ${roomId}`);
    socket.leave(roomId);
  });
};

export const startMarketBroadcast = (io) => {
  setInterval(async () => {
    try {
      const priceUpdate = generateSinglePriceUpdate();

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
  }, 250);
};