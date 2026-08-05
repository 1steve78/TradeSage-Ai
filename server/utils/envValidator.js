import logger from "../infrastructure/logger.js";

const requiredEnvVars = [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MONGO_URI",
];

export const validateEnv = () => {
    const missingVars = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    }

    if (missingVars.length > 0) {
        logger.error(`CRITICAL ERROR: Missing required environment variables: ${missingVars.join(", ")}`);
        process.exit(1);
    }
    
    logger.info("Environment variables validated successfully.");
};

export default validateEnv;
