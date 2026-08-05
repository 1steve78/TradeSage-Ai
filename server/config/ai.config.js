import dotenv from "dotenv";
dotenv.config();

export const aiConfig = {
    provider: process.env.AI_PROVIDER || "openai", // 'openai' or 'nvidia'
    circuitBreaker: {
        timeout: parseInt(process.env.AI_CB_TIMEOUT || "12000", 10),
        failureThreshold: parseInt(process.env.AI_CB_FAILURES || "3", 10),
        cooldown: parseInt(process.env.AI_CB_COOLDOWN || "60000", 10)
    }
};

export default aiConfig;
