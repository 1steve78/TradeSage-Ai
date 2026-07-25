import mongoose from "mongoose";
import AIConversation from "../../../models/AIConversation.js";

/**
 * Retrieves recent conversation messages (up to limit, default 5) for chat continuity.
 * 
 * @param {string} userId
 * @param {number} limit
 * @returns {Promise<Object>} { lastMessages }
 */
export const getConversationContext = async (userId, limit = 5) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected || !userId) {
    return { lastMessages: [] };
  }

  const conversationDocs = await AIConversation.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .maxTimeMS(2000)
    .lean();

  const lastMessages = conversationDocs.reverse().map((c) => ({
    role: c.role,
    content: c.message,
  }));

  return { lastMessages };
};

export default {
  getConversationContext,
};
