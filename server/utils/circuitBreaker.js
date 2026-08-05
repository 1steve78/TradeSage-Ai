import logger from "../infrastructure/logger.js";
import AppError from "./AppError.js";

const STATE = {
    CLOSED: "CLOSED",       // Healthy
    OPEN: "OPEN",           // Failing, fast-fail requests
    HALF_OPEN: "HALF_OPEN"  // Testing recovery
};

class CircuitBreaker {
    constructor(name, config) {
        this.name = name;
        this.timeout = config.timeout || 3000;
        this.failureThreshold = config.failureThreshold || 5;
        this.cooldown = config.cooldown || 30000;
        
        this.state = STATE.CLOSED;
        this.failureCount = 0;
        this.nextAttempt = null;
    }

    async fire(action, fallback = null) {
        if (this.state === STATE.OPEN) {
            if (Date.now() > this.nextAttempt) {
                this.state = STATE.HALF_OPEN;
                logger.info(`CircuitBreaker [${this.name}] moved to HALF_OPEN`);
            } else {
                if (fallback) return typeof fallback === "function" ? fallback() : fallback;
                throw new AppError(`Service ${this.name} is currently unavailable.`, 503, "SERVICE_UNAVAILABLE");
            }
        }

        try {
            // Action wrapped in a timeout promise
            const result = await Promise.race([
                action(),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), this.timeout))
            ]);

            // Success
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure(error);
            if (fallback) return typeof fallback === "function" ? fallback() : fallback;
            throw error instanceof AppError ? error : new AppError(`Service ${this.name} failed: ${error.message}`, 502, "BAD_GATEWAY");
        }
    }

    onSuccess() {
        if (this.state === STATE.HALF_OPEN) {
            logger.info(`CircuitBreaker [${this.name}] recovered and moved to CLOSED`);
        }
        this.state = STATE.CLOSED;
        this.failureCount = 0;
    }

    onFailure(error) {
        this.failureCount++;
        logger.warn(`CircuitBreaker [${this.name}] failure (${this.failureCount}/${this.failureThreshold}): ${error.message}`);
        
        if (this.state === STATE.HALF_OPEN || this.failureCount >= this.failureThreshold) {
            this.state = STATE.OPEN;
            this.nextAttempt = Date.now() + this.cooldown;
            logger.error(`CircuitBreaker [${this.name}] tripped! Moved to OPEN. Next attempt in ${this.cooldown}ms`);
        }
    }
}

export default CircuitBreaker;
