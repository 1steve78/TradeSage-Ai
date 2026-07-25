import { Heart, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function PortfolioHealthWidget({ health }) {
  if (!health) return null;

  const { score = 85, rating = "Excellent", strengths = [], warnings = [] } = health;

  const getRatingColor = (r) => {
    switch (r?.toLowerCase()) {
      case "excellent":
        return "bg-emerald-500 text-white border-emerald-600";
      case "good":
        return "bg-green-500 text-white border-green-600";
      case "moderate":
        return "bg-amber-500 text-white border-amber-600";
      case "needs attention":
        return "bg-rose-500 text-white border-rose-600";
      default:
        return "bg-primary text-white border-primary";
    }
  };

  const getScoreBarColor = (s) => {
    if (s >= 80) return "bg-emerald-500";
    if (s >= 65) return "bg-green-500";
    if (s >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs font-sans space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Heart size={18} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-none">Portfolio Health</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Deterministic 5-Pillar Rule Analysis</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] uppercase tracking-wider border ${getRatingColor(rating)}`}>
          {rating}
        </span>
      </div>

      {/* Main Score Bar */}
      <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 leading-none">{score}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            Verified Financial Rules
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(score)}`}
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>
      </div>

      {/* Strengths & Warnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Strengths List */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={12} /> Key Strengths ({strengths.length})
          </h4>
          <ul className="space-y-1">
            {strengths.slice(0, 3).map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-1.5 leading-snug">
                <span className="text-emerald-500 font-bold">✔</span>
                <span>{item}</span>
              </li>
            ))}
            {strengths.length === 0 && (
              <li className="text-xs text-slate-400 italic">No specific strengths flagged yet.</li>
            )}
          </ul>
        </div>

        {/* Warnings List */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={12} /> Optimization Alerts ({warnings.length})
          </h4>
          <ul className="space-y-1">
            {warnings.slice(0, 3).map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-1.5 leading-snug">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>{item}</span>
              </li>
            ))}
            {warnings.length === 0 && (
              <li className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                ✔ Portfolio optimal across all rules!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
