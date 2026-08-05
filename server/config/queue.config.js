import dotenv from "dotenv";
dotenv.config();

export const queueConfig = {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000 // 1s, 2s, 4s...
        },
        removeOnComplete: true,
        removeOnFail: false
    }
};

export default queueConfig;
