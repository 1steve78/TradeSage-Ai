import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import useMarketStore from "../store/marketStore";
import { EVENTS } from "../constants/events";

const SocketContext = createContext(null);

// 1. Singleton: Prevents React 18 Strict Mode double-connections
const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: true,
});

export const SocketProvider = ({ children }) => {
  const { updatePrice, connect, disconnect, subscribedWatchlist } = useMarketStore();

  useEffect(() => {
    // Define listeners as distinct functions for clean removal
    const onConnect = () => {
      console.log("🟢 Socket connected successfully! ID:", socket.id);
      connect();
      // Join global feed and current active watchlist on connect/reconnect
      socket.emit(EVENTS.JOIN_ROOM, "global-market");
      if (subscribedWatchlist) {
        console.log(`Re-joining active watchlist: ${subscribedWatchlist}`);
        socket.emit(EVENTS.JOIN_ROOM, subscribedWatchlist);
      }
    };

    const onDisconnect = (reason) => {
      console.log("🟡 Socket disconnected. Reason:", reason);
      disconnect();
    };

    const onConnectError = (err) => {
      console.error("🔴 Socket connection error:", err.message);
    };

    const onPriceUpdate = (price) => {
      updatePrice(price);
    };

    // Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on(EVENTS.PRICE_UPDATE, onPriceUpdate);

    // 2. Cleanup: Remove listeners when the component unmounts
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off(EVENTS.PRICE_UPDATE, onPriceUpdate);
    };
  }, [connect, disconnect, updatePrice, subscribedWatchlist]);

  const joinWatchlist = (id) => {
    socket.emit(EVENTS.JOIN_ROOM, id);
  };

  const leaveWatchlist = (id) => {
    socket.emit(EVENTS.LEAVE_ROOM, id);
  };

  return (
    <SocketContext.Provider value={{ socket, joinWatchlist, leaveWatchlist }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);