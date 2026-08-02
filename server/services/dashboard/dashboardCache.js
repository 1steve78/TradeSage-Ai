const cache = new Map();

// Default TTL: 60 seconds
const TTL = 60 * 1000;

export const getCachedDashboard = (userId) => {
    const entry = cache.get(userId.toString());
    if (!entry) return null;

    if (Date.now() - entry.timestamp > TTL) {
        cache.delete(userId.toString());
        return null;
    }

    return entry.data;
};

export const setCachedDashboard = (userId, data) => {
    cache.set(userId.toString(), {
        timestamp: Date.now(),
        data
    });
};

export const clearCache = (userId) => {
    cache.delete(userId.toString());
};
