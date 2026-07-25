import { useState, useEffect, useRef } from "react";
import { sendAIChat, getAIChatHistory, clearAIChatHistory } from "../../../api/aiApi";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import TypingIndicator from "./TypingIndicator";
import { Bot, Trash2, RefreshCw, X, Sparkles, History } from "lucide-react";

export default function AIChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch initial history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const res = await getAIChatHistory();
        if (res.success && Array.isArray(res.data)) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error("Failed to load AI chat history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSendMessage = async (questionText) => {
    if (!questionText || loading) return;

    setError(null);
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: questionText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendAIChat(questionText, "portfolio");
      if (res.success && res.data) {
        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: res.data.answer || res.data.response,
          sources: res.data.sources || ["portfolio"],
          healthScore: res.data.healthScore,
          intent: res.data.intent,
          createdAt: res.data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(res.message || "Failed to analyze portfolio.");
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      setError("Unable to analyze your portfolio right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your AI chat history?")) {
      try {
        await clearAIChatHistory();
        setMessages([]);
      } catch (err) {
        console.error("Failed to clear chat history:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-xs">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 leading-none">
              TradeSage AI Assistant
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                RAG v2
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Grounded AI Portfolio Investment Analyst
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Clear Conversation History"
            >
              <Trash2 size={16} />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs font-medium gap-2">
            <RefreshCw size={14} className="animate-spin text-primary" /> Loading portfolio history...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Sparkles size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">
              Ask TradeSage AI Anything About Your Portfolio
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              Ask about your cash balances, biggest gainers, sector exposure, risk profile, or recent trades.
            </p>

            <SuggestedQuestions onSelectQuestion={handleSendMessage} disabled={loading} />
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatBubble key={msg.id || index} message={msg} />
            ))}

            {loading && <TypingIndicator />}

            {error && (
              <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-700 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggested Questions Quick Bar (when conversation active) */}
      {messages.length > 0 && !loading && (
        <div className="px-3 py-1.5 bg-white/70 border-t border-slate-100 shrink-0">
          <SuggestedQuestions onSelectQuestion={handleSendMessage} disabled={loading} />
        </div>
      )}

      {/* Bottom Chat Input */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}
