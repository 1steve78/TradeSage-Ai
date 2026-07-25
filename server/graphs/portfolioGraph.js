import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { retrieveForQuestion, cleanPortfolioContext, classifyQuestion } from "../services/ai/retrievalService.js";
import { analyzePortfolioRules } from "../services/ai/ruleEngineService.js";
import { buildPortfolioPrompt } from "../services/ai/portfolioPromptService.js";
import { generateNIMCompletion } from "../services/ai/nimService.js";
import AIConversation from "../models/AIConversation.js";

/**
 * State definition for Portfolio LangGraph Reasoning Pipeline (Milestone 3)
 */
export const PortfolioGraphStateAnnotation = Annotation.Root({
  userId: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => null }),
  question: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "" }),
  intent: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "general" }),
  categories: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => [] }),
  cleanContext: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => null }),
  riskAnalysis: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => null }),
  history: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => [] }),
  messages: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => [] }),
  response: Annotation({ reducer: (x, y) => (y !== undefined ? y : x), default: () => "" }),
});

// Node 1: Question Classifier Node
const classifyQuestionNode = async (state) => {
  const { intent, categories } = classifyQuestion(state.question);
  return { intent, categories };
};

// Node 2: Selective Retrieval Node
const selectiveRetrieveNode = async (state) => {
  const { intent, categories, context, history } = await retrieveForQuestion(state.userId, state.question);
  const cleanContext = cleanPortfolioContext(context);
  return {
    intent,
    categories,
    cleanContext,
    history,
  };
};

// Node 3: Rule Engine Node (Deterministic Risk & Health Checks)
const ruleEngineNode = async (state) => {
  const riskAnalysis = analyzePortfolioRules(state.cleanContext);
  return { riskAnalysis };
};

// Node 4: Prompt Builder Node
const buildPromptNode = async (state) => {
  const messages = buildPortfolioPrompt(
    state.cleanContext,
    state.question,
    state.history,
    state.riskAnalysis
  );
  return { messages };
};

// Node 5: NVIDIA NIM LLM Node
const callNIMNode = async (state) => {
  const response = await generateNIMCompletion(state.messages);
  return { response };
};

// Node 6: Save Conversation Node
const saveConversationNode = async (state) => {
  if (state.userId && state.question && state.response) {
    try {
      await AIConversation.insertMany([
        { userId: state.userId, role: "user", message: state.question },
        { userId: state.userId, role: "assistant", message: state.response },
      ]);
    } catch (err) {
      console.error("Failed to save AI conversation history:", err);
    }
  }
  return {};
};

// Assemble LangGraph State Graph Workflow
const workflow = new StateGraph(PortfolioGraphStateAnnotation)
  .addNode("classifyQuestion", classifyQuestionNode)
  .addNode("selectiveRetrieve", selectiveRetrieveNode)
  .addNode("ruleEngine", ruleEngineNode)
  .addNode("buildPrompt", buildPromptNode)
  .addNode("callNIM", callNIMNode)
  .addNode("saveConversation", saveConversationNode)
  .addEdge(START, "classifyQuestion")
  .addEdge("classifyQuestion", "selectiveRetrieve")
  .addEdge("selectiveRetrieve", "ruleEngine")
  .addEdge("ruleEngine", "buildPrompt")
  .addEdge("buildPrompt", "callNIM")
  .addEdge("callNIM", "saveConversation")
  .addEdge("saveConversation", END);

export const portfolioGraph = workflow.compile();
export default portfolioGraph;
