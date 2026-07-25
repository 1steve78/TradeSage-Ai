import portfolioGraph from "../graphs/portfolioGraph.js";
import AIConversation from "../models/AIConversation.js";

/**
 * Standardized AI Chat Endpoint Handler
 * @route POST /api/ai/chat
 * @body { type: string, question: string }
 */
export const handleAIChat = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { type = "portfolio", question } = req.body || {};

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question string is required.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User authentication required.",
      });
    }

    let result = null;

    switch (type.toLowerCase()) {
      case "portfolio":
        result = await portfolioGraph.invoke({
          userId,
          question: question.trim(),
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported AI chat type '${type}'. Supported types: portfolio`,
        });
    }

    // Standardized sources output mapping
    const sources = (result.categories || ["PORTFOLIO"]).map((cat) => cat.toLowerCase());

    return res.status(200).json({
      success: true,
      data: {
        type,
        question: question.trim(),
        answer: result.response,
        response: result.response,
        sources,
        intent: result.intent || "general",
        healthScore: result.riskAnalysis?.healthScore ?? null,
        riskAnalysis: result.riskAnalysis || null,
        context: result.cleanContext,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in handleAIChat controller:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to analyze your portfolio right now. Please try again.",
    });
  }
};

/**
 * Retrieves AI chat conversation history for authenticated user
 * @route GET /api/ai/chat/history
 */
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const limit = parseInt(req.query.limit, 10) || 50;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const conversations = await AIConversation.find({ userId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: conversations.map((c) => ({
        id: c._id,
        role: c.role,
        message: c.message,
        content: c.message,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error in getChatHistory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history.",
    });
  }
};

/**
 * Clears AI chat conversation history for authenticated user
 * @route DELETE /api/ai/chat/history
 */
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    await AIConversation.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Chat history cleared successfully.",
    });
  } catch (error) {
    console.error("Error in clearChatHistory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear chat history.",
    });
  }
};

export default {
  handleAIChat,
  getChatHistory,
  clearChatHistory,
};
