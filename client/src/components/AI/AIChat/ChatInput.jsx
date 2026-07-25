import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({ onSendMessage, disabled = false }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask TradeSage AI about your portfolio..."
        disabled={disabled}
        rows={1}
        className="flex-1 max-h-24 resize-none bg-transparent border-0 px-2 py-1.5 text-sm text-slate-800 focus:outline-hidden disabled:opacity-50 placeholder:text-slate-400 font-sans"
      />

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-40 disabled:hover:bg-primary transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center"
        title="Send Message"
      >
        <SendHorizontal size={18} />
      </button>
    </form>
  );
}
