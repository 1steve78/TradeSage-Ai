import { Bot, User, ShieldAlert, Layers } from "lucide-react";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const getSourceLabel = (src) => {
    switch (src.toLowerCase()) {
      case "portfolio":
        return "📊 Portfolio";
      case "analytics":
      case "performance":
        return "📈 Analytics";
      case "transactions":
        return "📜 Transactions";
      case "watchlist":
        return "⭐ Watchlist";
      case "risk":
        return "🛡️ Risk Engine";
      case "sector":
        return "🍕 Sectors";
      default:
        return `🔍 ${src}`;
    }
  };

  return (
    <div className={`flex items-start gap-3 my-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs shrink-0 ${
          isUser
            ? "bg-slate-800 text-white"
            : "bg-primary text-white"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={18} />}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed shadow-2xs ${
          isUser
            ? "bg-primary text-white rounded-tr-xs"
            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
        }`}
      >
        {/* Content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content || message.message || message.answer}
          {message.streaming && (
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
          )}
        </div>

        {/* Assistant Metadata (Sources & Health Score) */}
        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            {/* Sources list */}
            {Array.isArray(message.sources) && message.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-slate-400 font-bold uppercase text-[9px] flex items-center gap-0.5 mr-1">
                  <Layers size={10} /> Sources:
                </span>
                {message.sources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]"
                  >
                    {getSourceLabel(src)}
                  </span>
                ))}
              </div>
            )}

            {/* Health score badge if provided */}
            {typeof message.healthScore === "number" && (
              <div className="flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 ml-auto">
                <ShieldAlert size={11} /> Health Score: {message.healthScore}/100
              </div>
            )}

            {/* Timestamp */}
            {message.createdAt && (
              <span className="text-[10px] text-slate-400 font-medium ml-auto">
                {formatTimestamp(message.createdAt)}
              </span>
            )}
          </div>
        )}

        {isUser && message.createdAt && (
          <div className="mt-1 text-[10px] text-primary-100 text-right opacity-80 font-medium">
            {formatTimestamp(message.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
}
