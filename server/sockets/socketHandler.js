import { EVENTS } from "../constants/events.js";
import { registerMarketEvents, startMarketBroadcast } from "./marketSocket.js";
import { registerWatchlistEvents } from "./watchlistSocket.js";

export const initializeSocket = (io) => {
  // Start the global market broadcast loop
  startMarketBroadcast(io);

  io.on(EVENTS.CONNECTION, (socket) => {
    console.log(`✅ Client Connected: ${socket.id}`);

    // Register external modules
    registerMarketEvents(socket);
    registerWatchlistEvents(socket);
    
    // Join Room
    socket.on(EVENTS.JOIN_ROOM, (roomName) => {
      if (!roomName || typeof roomName !== 'string') return;
      socket.join(roomName);
      socket.emit(EVENTS.JOINED_ROOM, roomName);
    });

    // Leave Room
    socket.on(EVENTS.LEAVE_ROOM, (roomName) => {
      if (!roomName || typeof roomName !== 'string') return;
      socket.leave(roomName);
      socket.emit(EVENTS.LEFT_ROOM, roomName);
    });

    // Disconnect
    socket.on(EVENTS.DISCONNECT, () => {
      console.log(`❌ Client Disconnected: ${socket.id}`);
    });
  });
};

export default initializeSocket;