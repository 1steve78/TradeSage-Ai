import { Brain, RefreshCw } from "lucide-react";

export default function TodaysInsightWidget({ insight, timestamp, onRefresh, loading = false }) {
  const formatTimeAgo = (ts) => {
    if (!ts) return "Just now";
    try {
      const diffMs = Date.now() - new Date(ts).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hr ago`;
    } catch {
      return "Today";
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md font-sans space-y-3 relative overflow-hidden">
      {/* Background Graphic Accent */}
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-white">
        <Brain size={120} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary-300 flex items-center justify-center border border-primary/30 shrink-0">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white leading-none flex items-center gap-2">
              Today's AI Insight
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/30 text-primary-200 uppercase tracking-wider">
                Daily Commentary
              </span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Generated {formatTimeAgo(timestamp)}
            </span>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Insight"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="relative z-10 bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
        {loading ? (
          <div className="flex items-center justify-center py-4 text-slate-400 gap-2 font-medium">
            <RefreshCw size={14} className="animate-spin text-primary-400" />
            Analyzing portfolio performance...
          </div>
        ) : (
          insight || "Your daily AI portfolio commentary will appear here based on your holdings."
        )}
      </div>
    </div>
  );
}
