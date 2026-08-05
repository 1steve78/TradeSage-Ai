import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => {
        return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`;
    })
);

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        new DailyRotateFile({
            filename: path.join(logDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "14d"
        }),
        new DailyRotateFile({
            filename: path.join(logDir, "combined-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d"
        })
    ]
});

export default logger;
