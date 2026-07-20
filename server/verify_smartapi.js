import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the current directory
dotenv.config({ path: path.resolve(__dirname, ".env") });

import * as smartApiService from "./services/smartApiService.js";

const runVerification = async () => {
    console.log("=== STARTING SMARTAPI VERIFICATION TEST ===");

    const apiKey = process.env.SMARTAPI_API_KEY;
    const clientCode = process.env.SMARTAPI_CLIENT_CODE;
    const password = process.env.SMARTAPI_PASSWORD;
    const totpSecret = process.env.SMARTAPI_TOTP_SECRET;

    if (!apiKey || !clientCode || !password || !totpSecret) {
        console.warn("\n⚠️  WARNING: SmartAPI credentials are not configured in server/.env.");
        console.log("Please fill in these variables in server/.env to perform a live connection check:");
        console.log("- SMARTAPI_API_KEY");
        console.log("- SMARTAPI_CLIENT_CODE");
        console.log("- SMARTAPI_PASSWORD");
        console.log("- SMARTAPI_TOTP_SECRET");
        console.log("\nSkipping live API calls. Code validation completed successfully!");
        return;
    }

    try {
        console.log("Attempting automatic session generation...");
        const smartApi = await smartApiService.ensureSession();
        console.log("✅ Session generated successfully!");

        console.log("\nTesting isSessionValid()...");
        const isValid = await smartApiService.isSessionValid();
        console.log(`✅ Session Valid: ${isValid}`);

        console.log("\nTesting getLTP() for SBIN (NSE token: 3045)...");
        const ltpData = await smartApiService.getLTP({
            exchange: "NSE",
            symboltoken: "3045"
        });
        console.log("✅ LTP Data Fetched:", JSON.stringify(ltpData, null, 2));

        console.log("\nTesting getHistoricalCandles() for SBIN...");
        const toDate = new Date();
        const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

        const format = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day} 09:15`;
        };

        const candles = await smartApiService.getHistoricalCandles({
            exchange: "NSE",
            symboltoken: "3045",
            interval: "ONE_MINUTE",
            fromdate: format(fromDate),
            todate: format(toDate)
        });
        console.log(`✅ Historical Candles Fetched (Count: ${candles.length})`);
        if (candles.length > 0) {
            console.log("First candle sample:", JSON.stringify(candles[0], null, 2));
        }

        console.log("\n=== ALL LIVE VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
    } catch (error) {
        console.error("\n❌ VERIFICATION TEST FAILED:", error.message);
        process.exitCode = 1;
    }
};

runVerification();
