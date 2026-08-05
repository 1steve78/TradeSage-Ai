import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default appConfig;
