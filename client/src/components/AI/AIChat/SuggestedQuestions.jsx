import { Sparkles } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Portfolio summary",
  "Biggest winner/loser",
  "Cash available",
  "Sector allocation",
];

export default function SuggestedQuestions({ onSelectQuestion, disabled = false, isGrid = false }) {
  return (
    <div className={`py-2 ${isGrid ? "w-[280px] sm:w-[340px] max-w-full mx-auto shrink-0" : "w-full overflow-x-auto scrollbar-hide px-1"}`}>
      {isGrid && (
        <div className="flex items-center justify-center gap-1.5 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Sparkles size={12} className="text-primary" />
          <span>Suggested Questions</span>
        </div>
      )}

      <div className={`${isGrid ? "grid grid-cols-2 gap-2" : "flex gap-2 min-w-max"}`}>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => !disabled && onSelectQuestion(q)}
            disabled={disabled}
            className={`px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-600 hover:text-primary rounded-xl border border-slate-200 hover:border-primary/40 transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${isGrid ? "text-center" : "text-left whitespace-nowrap"}`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
