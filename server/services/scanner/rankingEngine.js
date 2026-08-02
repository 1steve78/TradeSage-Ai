/**
 * Ranks stocks based on a set of dynamic factors.
 * The maximum score is 100.
 */
export const rankStocks = (stocks) => {
    return stocks.map(stock => {
        let score = 0;
        let reasons = [];

        // 1. Positive Sentiment (+30 max)
        if (stock.sentiment === "Bullish") {
            score += 30;
            reasons.push("Bullish Sentiment");
        } else if (stock.sentiment === "Slightly Bullish") {
            score += 15;
            reasons.push("Positive Sentiment");
        }

        // 2. High Volume (+20 max)
        if (stock.volume > 5000000) {
            score += 20;
            reasons.push("High Volume");
        } else if (stock.volume > 1000000) {
            score += 10;
            reasons.push("Above Average Volume");
        }

        // 3. Positive Change (+15 max)
        if (stock.change > 5) {
            score += 15;
            reasons.push("Strong Momentum");
        } else if (stock.change > 0) {
            score += 10;
            reasons.push("Positive Change");
        }

        // 4. AI Confidence (+20 max) - simulated for now
        if (stock.aiConfidence > 80) {
            score += 20;
            reasons.push("High AI Confidence");
        } else if (stock.aiConfidence > 50) {
            score += 10;
        }

        // 5. Technical Signal (+15 max)
        if (stock.technicalSignal === "Strong Buy") {
            score += 15;
            reasons.push("Strong Technicals");
        } else if (stock.technicalSignal === "Buy") {
            score += 10;
            reasons.push("Positive Technicals");
        }

        return {
            ...stock,
            score: Math.min(100, score),
            reasons
        };
    });
};
