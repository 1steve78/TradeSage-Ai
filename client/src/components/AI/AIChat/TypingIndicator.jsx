import { useState, useEffect } from "react";
import { Bot } from "lucide-react";

const STEPS = [
  "Analyzing Portfolio...",
  "Calculating Performance...",
  "Checking Risk Rules...",
  "Generating Explanation...",
];

export default function TypingIndicator() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 my-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
        <Bot size={18} className="animate-pulse" />
      </div>

      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs max-w-[85%]">
        <div className="flex items-center gap-2">
          <span className="flex gap-1 items-center">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
          </span>

          <span className="text-xs font-semibold text-slate-600 tracking-wide font-body-md transition-all duration-300">
            {STEPS[stepIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
