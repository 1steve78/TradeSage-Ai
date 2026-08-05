import dotenv from "dotenv";
dotenv.config();

export const redisConfig = {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    circuitBreaker: {
        timeout: parseInt(process.env.REDIS_CB_TIMEOUT || "2000", 10),
        failureThreshold: parseInt(process.env.REDIS_CB_FAILURES || "3", 10),
        cooldown: parseInt(process.env.REDIS_CB_COOLDOWN || "10000", 10)
    }
};

export default redisConfig;
