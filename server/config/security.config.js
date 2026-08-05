import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
dotenv.config();

export const securityConfig = {
    jwtSecret: process.env.JWT_SECRET || "fallback_secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",
};

export const rateLimitConfig = {
    global: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, // limit each IP to 500 requests per windowMs
        message: "Too many requests from this IP, please try again later."
    },
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 5 login/register requests per windowMs
        message: "Too many login attempts from this IP, please try again after 15 minutes."
    },
    ai: {
        windowMs: 60 * 1000, // 1 minute
        max: 20,
        message: "Too many AI requests from this IP, please try again in a minute."
    },
    orders: {
        windowMs: 60 * 1000, // 1 minute
        max: 60,
        message: "Too many order requests from this IP, please try again in a minute."
    },
    market: {
        windowMs: 60 * 1000, // 1 minute
        max: 120,
        message: "Too many market data requests from this IP, please try again in a minute."
    },
    dashboard: {
        windowMs: 60 * 1000, // 1 minute
        max: 120,
        message: "Too many dashboard requests from this IP, please try again in a minute."
    }
};

export const globalLimiter = rateLimit(rateLimitConfig.global);
export const authLimiter = rateLimit(rateLimitConfig.auth);
export const aiLimiter = rateLimit(rateLimitConfig.ai);
export const ordersLimiter = rateLimit(rateLimitConfig.orders);
export const marketLimiter = rateLimit(rateLimitConfig.market);
export const dashboardLimiter = rateLimit(rateLimitConfig.dashboard);

export default securityConfig;
