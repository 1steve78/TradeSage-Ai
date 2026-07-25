import { Sparkles } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Why is my portfolio down?",
  "Biggest winner?",
  "Biggest loser?",
  "Cash available?",
  "Sector allocation?",
  "Portfolio summary?",
  "Highest risk holding?",
];

export default function SuggestedQuestions({ onSelectQuestion, disabled = false }) {
  return (
    <div className="py-2 px-1">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Sparkles size={13} className="text-primary" />
        <span>Suggested Questions</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => !disabled && onSelectQuestion(q)}
            disabled={disabled}
            className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 hover:text-primary rounded-full border border-slate-200 hover:border-primary/40 transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
