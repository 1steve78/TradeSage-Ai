import { SmartAPI } from "smartapi-javascript";
import { generate } from "otplib";
import axios from "axios";

let smartApiInstance = null;
let sessionData = null;
let sessionCreatedAt = null;

/**
 * Checks if the cached session exists and is still fresh (valid for up to 20 hours).
 * @returns {boolean}
 */
const isSessionFresh = () => {
    if (!smartApiInstance || !sessionData || !sessionCreatedAt) {
        return false;
    }
    // Session is valid for 24 hours. We refresh after 20 hours to be safe.
    const TWENTY_HOURS_MS = 20 * 60 * 60 * 1000;
    return (Date.now() - sessionCreatedAt) < TWENTY_HOURS_MS;
};

/**
 * Ensures a valid session is active with Angel One SmartAPI.
 * If no session is active or the cached session is expired, it logs in programmatically.
 * @returns {Promise<SmartAPI>} Active SmartAPI instance
 */
export const ensureSession = async () => {
    if (isSessionFresh()) {
        return smartApiInstance;
    }

    const apiKey = process.env.SMARTAPI_API_KEY;
    const clientCode = process.env.SMARTAPI_CLIENT_CODE;
    const password = process.env.SMARTAPI_PASSWORD;
    const totpSecret = process.env.SMARTAPI_TOTP_SECRET;

    if (!apiKey || !clientCode || !password || !totpSecret) {
        throw new Error(
            "CRITICAL: Angel One SmartAPI credentials are not fully configured in environment variables (.env)."
        );
    }

    try {
        console.log("Generating TOTP token...");
        const totpToken = await generate({ secret: totpSecret });

        const smartApi = new SmartAPI({
            api_key: apiKey
        });

        console.log(`Attempting programmatic login for client: ${clientCode}...`);
        const response = await smartApi.generateSession(clientCode, password, totpToken);

        if (!response || !response.status) {
            console.error("SmartAPI login failed. Full Response:", JSON.stringify(response, null, 2));
            throw new Error(
                response?.message || "Login call returned unsuccessful status."
            );
        }

        // Set access and refresh tokens to be absolutely sure instance is ready
        if (response.data?.jwtToken) {
            smartApi.setAccessToken(response.data.jwtToken);
        }
        if (response.data?.refreshToken) {
            smartApi.setPublicToken(response.data.refreshToken);
        }

        smartApiInstance = smartApi;
        sessionData = response.data;
        sessionCreatedAt = Date.now();

        console.log("Angel One SmartAPI session successfully established.");
        return smartApiInstance;
    } catch (error) {
        console.error("SmartAPI Session Generation failed:", error.message);
        // Clear cached instances on failure to force retry next time
        smartApiInstance = null;
        sessionData = null;
        sessionCreatedAt = null;
        throw new Error(`SmartAPI Authentication Failed: ${error.message}`);
    }
};

/**
 * Returns whether a session is valid by running a lightweight profile query.
 * @returns {Promise<boolean>}
 */
export const isSessionValid = async () => {
    try {
        const smartApi = await ensureSession();
        const profile = await smartApi.getProfile();
        return !!(profile && profile.status);
    } catch (error) {
        return false;
    }
};

/**
 * Fetches historical candle data for a given token.
 * @param {Object} params
 * @param {string} params.exchange (NSE, BSE, NFO, MCX)
 * @param {string} params.symboltoken (Unique token code)
 * @param {string} params.interval (ONE_MINUTE, FIVE_MINUTE, FIFTEEN_MINUTE, THIRTY_MINUTE, ONE_HOUR, ONE_DAY)
 * @param {string} params.fromdate (Format: YYYY-MM-DD HH:mm)
 * @param {string} params.todate (Format: YYYY-MM-DD HH:mm)
 */
export const getHistoricalCandles = async (params) => {
    const smartApi = await ensureSession();
    const response = await smartApi.getCandleData(params);
    if (!response || !response.status) {
        throw new Error(response?.message || "Failed to fetch historical candles.");
    }
    return response.data;
};

/**
 * Fetches Last Traded Price (LTP) for a specific symbol token.
 * @param {Object} params
 * @param {string} params.exchange (NSE, BSE, etc.)
 * @param {string} params.symboltoken (Unique token code)
 */
export const getLTP = async ({ exchange, symboltoken }) => {
    const smartApi = await ensureSession();
    const response = await smartApi.marketData({
        mode: "LTP",
        exchangeTokens: {
            [exchange]: [symboltoken]
        }
    });

    if (!response || !response.status || !response.data) {
        throw new Error(response?.message || "Failed to fetch LTP.");
    }

    const fetchedData = response.data.fetched;
    if (fetchedData && fetchedData.length > 0) {
        return fetchedData[0];
    }
    throw new Error("No LTP data returned for the specified token.");
};

/**
 * Fetches 5-depth Market Depth/Quotes for a specific symbol token.
 * @param {Object} params
 * @param {string} params.exchange
 * @param {string} params.symboltoken
 */
export const getMarketDepth = async ({ exchange, symboltoken }) => {
    const smartApi = await ensureSession();
    const response = await smartApi.marketData({
        mode: "FULL",
        exchangeTokens: {
            [exchange]: [symboltoken]
        }
    });

    if (!response || !response.status || !response.data) {
        throw new Error(response?.message || "Failed to fetch market depth.");
    }

    const fetchedData = response.data.fetched;
    if (fetchedData && fetchedData.length > 0) {
        return fetchedData[0];
    }
    throw new Error("No market depth data returned for the specified token.");
};

/**
 * Fetches Option Greek values or OI data from Angel One.
 * @param {Object} params
 */
export const getOptionChain = async (params) => {
    const smartApi = await ensureSession();
    const response = await smartApi.optionGreek(params);
    if (!response || !response.status) {
        throw new Error(response?.message || "Failed to fetch option Greeks.");
    }
    return response.data;
};

/**
 * Downloads the entire Angel One scrip master JSON database.
 * This can be used to search for tokens and trading symbols offline.
 */
export const getInstruments = async () => {
    console.log("Downloading scrip master database from Angel One...");
    const response = await axios.get(
        "https://margincalculator.angelbroking.com/OpenAPI_ScripMaster/files/OpenAPIScripMaster.json",
        { timeout: 15000 }
    );
    return response.data;
};
