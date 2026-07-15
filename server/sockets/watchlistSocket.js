import { EVENTS } from "../constants/events.js";
import { joinWatchlist, leaveWatchlist } from "./roomManager.js";

export const registerWatchlistEvents = (
    socket
) => {

    socket.on(
        EVENTS.JOIN_WATCHLIST,
        (watchlistId) => {

            const room =
                `watchlist:${watchlistId}`;

            socket.join(room);

            joinWatchlist(watchlistId,socket.id);

            console.log(
                `${socket.id} joined ${room}`
            );

        }
    );

    socket.on(
        EVENTS.LEAVE_WATCHLIST,
        (watchlistId) => {

            const room =
                `watchlist:${watchlistId}`;

            socket.leave(room);

            leaveWatchlist(watchlistId,socket.id);

            console.log(
                `${socket.id} left ${room}`
            );

        }
    );

};