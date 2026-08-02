import crypto from "crypto";

const cache = new Map();
// Default TTL: 5 minutes
const TTL = 5 * 60 * 1000;

const generateCacheKey = (filters) => {
    const filterString = JSON.stringify(filters || {});
    return crypto.createHash("md5").update(filterString).digest("hex");
};

export const getCachedScan = (filters) => {
    const key = generateCacheKey(filters);
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > TTL) {
        cache.delete(key);
        return null;
    }

    return entry.data;
};

export const setCachedScan = (filters, data) => {
    const key = generateCacheKey(filters);
    cache.set(key, {
        timestamp: Date.now(),
        data
    });
};

export const clearScannerCache = () => {
    cache.clear();
};
