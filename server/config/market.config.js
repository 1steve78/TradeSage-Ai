import dotenv from "dotenv";
dotenv.config();

export const marketConfig = {
    finnhubRest: {
        timeout: parseInt(process.env.FINNHUB_REST_CB_TIMEOUT || "3000", 10),
        failureThreshold: parseInt(process.env.FINNHUB_REST_CB_FAILURES || "5", 10),
        cooldown: parseInt(process.env.FINNHUB_REST_CB_COOLDOWN || "30000", 10)
    },
    smartApi: {
        timeout: parseInt(process.env.SMARTAPI_CB_TIMEOUT || "5000", 10),
        failureThreshold: parseInt(process.env.SMARTAPI_CB_FAILURES || "3", 10),
        cooldown: parseInt(process.env.SMARTAPI_CB_COOLDOWN || "30000", 10)
    },
    newsApi: {
        timeout: parseInt(process.env.NEWS_CB_TIMEOUT || "5000", 10),
        failureThreshold: parseInt(process.env.NEWS_CB_FAILURES || "5", 10),
        cooldown: parseInt(process.env.NEWS_CB_COOLDOWN || "30000", 10)
    }
};

export default marketConfig;
