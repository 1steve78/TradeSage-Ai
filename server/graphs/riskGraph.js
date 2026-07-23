import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { buildMarketContext } from "../services/ai/contextService.js";
import { findCachedInsight, saveInsight } from "../services/ai/cacheService.js";
import { riskPrompt } from "../services/ai/promptService.js";
import { generateNIMCompletion } from "../services/ai/nimService.js";

export const RiskStateAnnotation = Annotation.Root({
  userId: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => null }),
  type: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "RISK" }),
  skipCache: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => false }),
  context: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => null }),
  contextHash: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "" }),
  cached: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => null }),
  prompt: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "" }),
  response: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "" }),
  fromCache: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => false }),
});

const buildContextNode = async (state) => {
  const { context, contextHash } = await buildMarketContext(state.userId);
  return { context, contextHash };
};

const cacheLookupNode = async (state) => {
  if (state.skipCache) return { cached: null, fromCache: false };
  const cached = await findCachedInsight(state.contextHash, "RISK");
  return cached ? { cached, response: cached.response, fromCache: true } : { cached: null, fromCache: false };
};

const promptBuilderNode = async (state) => {
  const prompt = riskPrompt(state.context);
  return { prompt };
};

const callNIMNode = async (state) => {
  const response = await generateNIMCompletion(state.prompt);
  return { response };
};

const saveCacheNode = async (state) => {
  if (state.response && !state.fromCache && state.contextHash) {
    await saveInsight({
      userId: state.userId,
      type: "RISK",
      prompt: state.prompt,
      response: state.response,
      contextHash: state.contextHash,
    });
  }
  return {};
};

const shouldSkipLLM = (state) => (state.fromCache && state.response ? "skipToEnd" : "continueToPrompt");

const workflow = new StateGraph(RiskStateAnnotation)
  .addNode("buildContext", buildContextNode)
  .addNode("cacheLookup", cacheLookupNode)
  .addNode("promptBuilder", promptBuilderNode)
  .addNode("callNIM", callNIMNode)
  .addNode("saveCache", saveCacheNode)
  .addEdge(START, "buildContext")
  .addEdge("buildContext", "cacheLookup")
  .addConditionalEdges("cacheLookup", shouldSkipLLM, { skipToEnd: END, continueToPrompt: "promptBuilder" })
  .addEdge("promptBuilder", "callNIM")
  .addEdge("callNIM", "saveCache")
  .addEdge("saveCache", END);

export const riskGraph = workflow.compile();
export default riskGraph;
