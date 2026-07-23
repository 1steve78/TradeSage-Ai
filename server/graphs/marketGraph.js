import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { buildMarketContext } from "../services/ai/contextService.js";
import { findCachedInsight, saveInsight } from "../services/ai/cacheService.js";
import { marketSummaryPrompt } from "../services/ai/promptService.js";
import { generateNIMCompletion } from "../services/ai/nimService.js";
import aiConfig from "../config/aiConfig.js";

// State Annotation Definition
export const MarketStateAnnotation = Annotation.Root({
  userId: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  type: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => "MARKET_PULSE",
  }),
  skipCache: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => false,
  }),
  context: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  contextHash: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => "",
  }),
  cached: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  prompt: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => "",
  }),
  response: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => "",
  }),
  fromCache: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => false,
  }),
});

// Node 1: Build Context
const buildContextNode = async (state) => {
  try {
    const { context, contextHash } = await buildMarketContext(state.userId);
    return { context, contextHash };
  } catch (error) {
    console.error("Context node error:", error.message);
    const fallbackContext = {
      timestamp: new Date().toISOString().split("T")[0],
      portfolio: null,
      analytics: null,
      watchlist: [],
      market: [],
      news: [],
    };
    return { context: fallbackContext, contextHash: "fallback_hash" };
  }
};

// Node 2: Cache Lookup (Bypassed if skipCache is true)
const cacheLookupNode = async (state) => {
  if (state.skipCache) {
    return { cached: null, fromCache: false };
  }
  try {
    const cached = await findCachedInsight(state.contextHash, state.type || "MARKET_PULSE");
    if (cached) {
      return {
        cached,
        response: cached.response,
        fromCache: true,
      };
    }
  } catch (error) {
    console.warn("Cache lookup node warning:", error.message);
  }
  return { cached: null, fromCache: false };
};

// Node 3: Prompt Builder
const promptBuilderNode = async (state) => {
  const prompt = marketSummaryPrompt(state.context);
  return { prompt };
};

// Node 4: Call NVIDIA NIM
const callNIMNode = async (state) => {
  try {
    if (!aiConfig.apiKey || aiConfig.apiKey === "dummy_key_for_initialization") {
      const mockResponse = `🧠 Market Pulse Summary\n\n• Technology & Banking benchmark stocks show steady intraday support.\n• Key portfolio holdings remain balanced against broad market volatility.\n• RBI rate stability provides positive macroeconomic backing for equities.`;
      return { response: mockResponse };
    }
    const response = await generateNIMCompletion(state.prompt);
    return { response };
  } catch (error) {
    console.error("NIM Node error:", error.message);
    const fallbackResponse = `🧠 Market Pulse Summary\n\n• Broad market benchmarks reflect neutral-to-bullish sentiment today.\n• Strategic watchlist stocks are tracking major sectoral trends.\n• Maintain risk management discipline across open positions.`;
    return { response: fallbackResponse };
  }
};

// Node 5: Save Cache
const saveCacheNode = async (state) => {
  try {
    if (state.response && !state.fromCache && state.contextHash && state.contextHash !== "fallback_hash") {
      await saveInsight({
        userId: state.userId,
        type: state.type || "MARKET_PULSE",
        prompt: state.prompt,
        response: state.response,
        contextHash: state.contextHash,
      });
    }
  } catch (error) {
    console.warn("Save cache node warning:", error.message);
  }
  return {};
};

// Conditional Edge Router
const shouldSkipLLM = (state) => {
  if (state.fromCache && state.response) {
    return "skipToEnd";
  }
  return "continueToPrompt";
};

// Build LangGraph Graph Workflow
const workflow = new StateGraph(MarketStateAnnotation)
  .addNode("buildContext", buildContextNode)
  .addNode("cacheLookup", cacheLookupNode)
  .addNode("promptBuilder", promptBuilderNode)
  .addNode("callNIM", callNIMNode)
  .addNode("saveCache", saveCacheNode)
  .addEdge(START, "buildContext")
  .addEdge("buildContext", "cacheLookup")
  .addConditionalEdges("cacheLookup", shouldSkipLLM, {
    skipToEnd: END,
    continueToPrompt: "promptBuilder",
  })
  .addEdge("promptBuilder", "callNIM")
  .addEdge("callNIM", "saveCache")
  .addEdge("saveCache", END);

// Compile Graph
export const marketGraph = workflow.compile();

export default marketGraph;
