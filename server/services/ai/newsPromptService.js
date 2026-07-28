/**
 * newsPromptService.js
 *
 * Formats prompt contexts and messages for news-grounded AI explanations.
 * Prevents LLM hallucinations by enforcing strict evidence-based guidelines.
 */

/**
 * Builds OpenAI/NIM chat messages for explaining a stock's price movement
 * using ONLY the supplied news context.
 *
 * @param {object} context
 * @param {string} context.symbol - Stock symbol (e.g. "RELIANCE")
 * @param {string} [context.priceChange] - Optional price change string (e.g. "+3.4%")
 * @param {string} [context.marketSentiment] - Overall news sentiment ("Bullish", "Bearish", "Neutral")
 * @param {object[]} context.news - Array of normalised + sentiment-analysed articles
 * @returns {object[]} Array of OpenAI message objects [{ role, content }]
 */
export function priceMovementPrompt({ symbol, priceChange, marketSentiment, news = [] }) {
  const systemPrompt = `You are a professional financial news analyst for TradeSage AI.
Your task is to explain today's price movement for the stock "${symbol}" ONLY using the supplied news context below.

STRICT INSTRUCTIONS:
1. Do NOT invent reasons, fabricate announcements, or speculate beyond the provided news text.
2. If the supplied news articles do not clearly explain the movement, state clearly that no definitive explanation can be determined from the current news coverage.
3. Keep your response concise, clear, and under 120 words.
4. Maintain an objective, institutional tone.
5. Do NOT provide financial or investment advice.`;

  const formattedArticles = news.length > 0
    ? news.slice(0, 5).map((a, i) => (
        `[Article ${i + 1}] Source: ${a.source || "Unknown"} | Published: ${a.publishedAt}
Headline: ${a.title}
Summary: ${a.summary || "No summary provided."}
Sentiment: ${a.sentiment || "Neutral"}`
      )).join("\n\n")
    : "No recent news articles found for this stock.";

  const userContent = `Stock: ${symbol}
${priceChange ? `Today's Price Change: ${priceChange}` : ""}
Overall News Sentiment: ${marketSentiment || "Neutral"}

Retrieved News Context:
${formattedArticles}

Please provide a concise, evidence-based explanation of why ${symbol} moved today.`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];
}

export default { priceMovementPrompt };
