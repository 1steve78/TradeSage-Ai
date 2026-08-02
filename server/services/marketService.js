import { getInstruments } from "./smartApiService.js";

let instrumentCache = null;
let lastCacheUpdate = null;

/**
 * Downloads and caches the Angel One OpenAPI Scrip Master.
 * Refreshes automatically every 24 hours.
 */
export const loadInstruments = async () => {
    if (instrumentCache && lastCacheUpdate && (Date.now() - lastCacheUpdate < 24 * 60 * 60 * 1000)) {
        return instrumentCache;
    }
    
    console.log("[marketService] Downloading SmartAPI instruments database...");
    try {
        const data = await getInstruments();
        // Keep only NSE and BSE equities to reduce memory footprint
        instrumentCache = data.filter(i => 
            (i.exch_seg === "NSE" || i.exch_seg === "BSE") && 
            (i.symbol.endsWith("-EQ") || i.instrumenttype === "")
        );
        lastCacheUpdate = Date.now();
        console.log(`[marketService] Successfully cached ${instrumentCache.length} NSE/BSE instruments.`);
        return instrumentCache;
    } catch (error) {
        console.error("[marketService] Failed to load SmartAPI instruments:", error.message);
        throw new Error("Unable to load instrument master database.");
    }
};

/**
 * Perform extremely fast offline symbol searches using the cached SmartAPI instrument list.
 */
export const searchStocks = async (query) => {
    if (!query || !query.trim()) {
        throw new Error("Search query is required");
    }
    
    const instruments = await loadInstruments();
    const upperQuery = query.trim().toUpperCase();
    
    const matches = [];
    for (const inst of instruments) {
        // inst.symbol = "TATAMOTORS-EQ" (NSE trading code with suffix)
        // inst.name   = display/company name
        // Strip the "-EQ" suffix to get the clean trading symbol
        const tradingSymbol = inst.symbol.replace(/-EQ$/, "");

        if (tradingSymbol.includes(upperQuery) || inst.name.toUpperCase().includes(upperQuery)) {
            matches.push({
                symbol: tradingSymbol,      // e.g., TATAMOTORS (clean NSE symbol)
                companyName: inst.name,      // e.g., TATA MOTORS LIMITED
                exchange: inst.exch_seg,     // e.g., NSE
                type: inst.instrumenttype || "EQ",
                token: inst.token            // Angel One scrip token for Smart API calls
            });
            
            if (matches.length >= 20) break; // limit to 20 results for speed
        }
    }
    
    return matches;
};

/**
 * Build a basic company profile from the SmartAPI instrument list.
 * Note: SmartAPI does not provide logos, industry, or market cap.
 */
export const getCompanyProfile = async (symbol) => {
    if (!symbol || !symbol.trim()) {
        throw new Error("Symbol is required");
    }

    try {
        const instruments = await loadInstruments();
        const upperSymbol = symbol.trim().toUpperCase();
        
        // Find exact match (prefer NSE)
        const inst = instruments.find(i => i.name === upperSymbol && i.exch_seg === "NSE") 
                  || instruments.find(i => i.name === upperSymbol);
        
        if (inst) {
            return {
                name: inst.name,
                exchange: inst.exch_seg,
                token: inst.token,
                finnhubIndustry: null, // Fallback
                marketCapitalization: null, // Fallback
                currency: "INR",
                logo: null // Fallback
            };
        }
        return {};
    } catch (error) {
        console.warn(`[marketService] Failed to fetch company profile for ${symbol}. Returning empty profile.`);
        return {};
    }
};