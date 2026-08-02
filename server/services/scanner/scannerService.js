import { loadInstruments } from "../marketService.js";
import { applyFilters } from "./filterEngine.js";
import { rankStocks } from "./rankingEngine.js";
import { getCachedScan, setCachedScan } from "./scannerCache.js";
import crypto from "crypto";

// Helper to generate a deterministic pseudo-random number between min and max based on a string
const seededRandom = (seed, min, max) => {
    const hash = crypto.createHash("md5").update(seed).digest("hex");
    const num = parseInt(hash.substring(0, 8), 16);
    return min + (num / 0xffffffff) * (max - min);
};

// Generates simulated rich market data for the instruments since we don't have a bulk API for this
const enrichInstrumentData = (instruments) => {
    return instruments.map(inst => {
        const seed = inst.symbol + new Date().toISOString().split('T')[0]; // Daily seed
        
        const price = seededRandom(seed + "price", 10, 5000);
        const volume = seededRandom(seed + "vol", 50000, 20000000);
        const change = seededRandom(seed + "change", -10, 15);
        
        // Sentiment
        const sentimentRoll = seededRandom(seed + "sent", 0, 100);
        let sentiment = "Neutral";
        if (sentimentRoll > 80) sentiment = "Bullish";
        else if (sentimentRoll > 60) sentiment = "Slightly Bullish";
        else if (sentimentRoll < 20) sentiment = "Bearish";
        else if (sentimentRoll < 40) sentiment = "Slightly Bearish";

        // Sector (Simulated mapping)
        const sectors = ["Technology", "Finance", "Energy", "Healthcare", "Utilities", "Consumer Discretionary", "Industrials"];
        const sectorIndex = Math.floor(seededRandom(seed + "sector", 0, sectors.length));
        
        // Technicals
        const techRoll = seededRandom(seed + "tech", 0, 100);
        let technicalSignal = "Hold";
        if (techRoll > 85) technicalSignal = "Strong Buy";
        else if (techRoll > 65) technicalSignal = "Buy";
        else if (techRoll < 15) technicalSignal = "Strong Sell";
        else if (techRoll < 35) technicalSignal = "Sell";

        return {
            symbol: inst.name,
            companyName: inst.name,
            exchange: inst.exch_seg,
            price: Number(price.toFixed(2)),
            volume: Math.floor(volume),
            change: Number(change.toFixed(2)),
            sentiment,
            sector: sectors[sectorIndex],
            aiConfidence: Math.floor(seededRandom(seed + "ai", 30, 99)),
            technicalSignal
        };
    });
};

export const runScanner = async (filters) => {
    // 1. Check cache
    const cached = getCachedScan(filters);
    if (cached) {
        return {
            ...cached,
            _source: "cache"
        };
    }

    // 2. Fetch base universe
    // We will use the top 500 instruments to keep the scan fast
    const allInstruments = await loadInstruments();
    const targetInstruments = allInstruments.slice(0, 500);

    // 3. Enrich with market data (simulated bulk data)
    const enrichedData = enrichInstrumentData(targetInstruments);

    // 4. Apply Filters
    const filteredData = applyFilters(enrichedData, filters);

    // 5. Apply Ranking Engine
    const rankedData = rankStocks(filteredData);

    // 6. Sort Results
    const sortBy = filters.sortBy || "Highest Score";
    let sortedData = [...rankedData];
    switch (sortBy) {
        case "Highest Score":
            sortedData.sort((a, b) => b.score - a.score);
            break;
        case "Highest Volume":
            sortedData.sort((a, b) => b.volume - a.volume);
            break;
        case "Highest Gain":
            sortedData.sort((a, b) => b.change - a.change);
            break;
        case "Lowest Price":
            sortedData.sort((a, b) => a.price - b.price);
            break;
        default:
            sortedData.sort((a, b) => b.score - a.score);
    }

    // Limit to top 50 results
    const results = sortedData.slice(0, 50);

    const payload = {
        totalMatches: filteredData.length,
        results
    };

    // 7. Update Cache
    setCachedScan(filters, payload);

    return {
        ...payload,
        _source: "live"
    };
};
