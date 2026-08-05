export const metrics = {
    totalRequests: 0,
    totalLatency: 0,
    averageLatency: 0,
    startTime: Date.now(),
};

export const performanceMonitor = (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1e9 + diff[1]) / 1e6;
        
        metrics.totalRequests++;
        metrics.totalLatency += timeInMs;
        metrics.averageLatency = metrics.totalLatency / metrics.totalRequests;
        
        // Log slowly responding requests
        if (timeInMs > 500) {
            console.warn(`[SLOW API] ${req.method} ${req.originalUrl} took ${timeInMs.toFixed(2)}ms`);
        }
    });
    
    next();
};
