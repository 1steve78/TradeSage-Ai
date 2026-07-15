const watchlistRooms = new Map();

export const joinWatchlist = (
  watchlistId,
  socketId
) => {
  if (!watchlistRooms.has(watchlistId)) {
    watchlistRooms.set(
      watchlistId,
      new Set()
    );
  }

  watchlistRooms
    .get(watchlistId)
    .add(socketId);
};

export const leaveWatchlist = (
  watchlistId,
  socketId
) => {
  const room =
    watchlistRooms.get(watchlistId);

  if (!room) return;

  room.delete(socketId);

  if (room.size === 0) {
    watchlistRooms.delete(
      watchlistId
    );
  }
};

export const getRooms = () =>
  watchlistRooms;