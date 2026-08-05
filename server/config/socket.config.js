import dotenv from "dotenv";
import { appConfig } from "./app.config.js";

dotenv.config();

export const socketConfig = {
    cors: {
        origin: appConfig.clientUrl,
        credentials: true
    }
};

export default socketConfig;
