import { generateNIMCompletion } from "./nimService.js";
import User from "../../models/User.js";

// Basic in-memory cache for morning briefs to prevent AI spamming
// Key: `${userId}_${dateString}`
const briefCache = new Map();

export const generateMorningBrief = async (userId, portfolioData, marketData) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const cacheKey = `${userId}_${todayStr}`;
        
        if (briefCache.has(cacheKey)) {
            return briefCache.get(cacheKey);
        }

        const user = await User.findById(userId);
        const name = user ? user.name.split(' ')[0] : "Trader";

        // If the user has no portfolio, return a welcome brief
        if (!portfolioData || portfolioData.totalValue === 0) {
            const emptyBrief = {
                greeting: `Welcome to TradeSage AI, ${name}! 👋`,
                summary: "It looks like you're just getting started. TradeSage AI is your intelligent co-pilot for the markets.",
                action: "Start by searching for a stock, adding it to your watchlist, or exploring the Market Scanner to find your first opportunity.",
                isNewUser: true
            };
            return emptyBrief;
        }

        // Construct the context for the AI
        const portfolioContext = `
        Portfolio Value: ₹${portfolioData.totalValue}
        Total P&L: ₹${portfolioData.totalPnL}
        Invested: ₹${portfolioData.investedValue}
        Cash: ₹${portfolioData.cash}
        Holdings: ${portfolioData.holdings.map(h => `${h.symbol} (${h.quantity})`).join(", ")}
        `;

        const marketContext = `
        Market Heat: ${marketData.marketHeat || 'Neutral'}
        Top Gainers: ${marketData.topGainers?.map(g => g.symbol).join(', ') || 'N/A'}
        Top Losers: ${marketData.topLosers?.map(l => l.symbol).join(', ') || 'N/A'}
        `;

        const prompt = `
        You are an elite financial assistant producing a personalized 'Morning Brief' for a user named ${name}.
        
        User Portfolio:
        ${portfolioContext}

        Market Context:
        ${marketContext}

        Generate a concise, engaging morning briefing. 
        Format your response as a valid JSON object strictly matching this structure:
        {
            "greeting": "Good Morning, ${name} 👋",
            "summary": "2-3 sentences summarizing the market and how their specific holdings might be affected.",
            "action": "1 sentence suggesting a focus for today based on their portfolio or market context."
        }
        
        Rules:
        - Maximum 150 words total.
        - Educational only. Do NOT provide direct financial advice (e.g. don't say "buy XYZ").
        - Must be valid JSON. No markdown wrappers.
        `;

        const response = await generateNIMCompletion([{ role: "user", content: prompt }]);
        
        // Parse JSON safely
        let briefObj;
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                briefObj = JSON.parse(jsonMatch[0]);
            } else {
                briefObj = JSON.parse(response);
            }
        } catch (e) {
            console.error("Failed to parse Morning Brief JSON", e);
            briefObj = {
                greeting: `Good Morning, ${name} 👋`,
                summary: "The markets are open. Your portfolio is being monitored by TradeSage AI.",
                action: "Keep an eye on the market scanner for new opportunities today."
            };
        }

        briefObj.isNewUser = false;
        
        // Cache the successful brief
        briefCache.set(cacheKey, briefObj);
        
        return briefObj;

    } catch (error) {
        console.error("Error generating morning brief:", error);
        return {
            greeting: "Good Morning 👋",
            summary: "Market connection established.",
            action: "Review your portfolio metrics below.",
            isNewUser: false
        };
    }
};
