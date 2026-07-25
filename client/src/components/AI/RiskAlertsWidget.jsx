import { ShieldAlert, AlertTriangle, Info } from "lucide-react";

export default function RiskAlertsWidget({ alerts = [] }) {
  if (!Array.isArray(alerts) || alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs font-sans">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={18} className="text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">Risk Alerts</h3>
        </div>
        <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/60 font-medium">
          ✔ No active risk alerts! Your portfolio parameters are within safe target thresholds.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return {
          badge: "bg-red-100 text-red-700 border-red-200",
          icon: <ShieldAlert size={14} className="text-red-600 shrink-0 mt-0.5" />,
          label: "HIGH RISK",
        };
      case "medium":
        return {
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />,
          label: "MEDIUM RISK",
        };
      default:
        return {
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />,
          label: "NOTICE",
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs font-sans space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-600" />
          <h3 className="font-bold text-sm text-slate-900">Active Risk Alerts</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {alerts.length} Alert{alerts.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert, idx) => {
          const style = getSeverityBadge(alert.severity);
          return (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2.5">
              {style.icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${style.badge}`}>
                    {style.label}
                  </span>
                  {alert.category && (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{alert.category}</span>
                  )}
                </div>
                <p className="text-xs text-slate-800 font-medium leading-snug">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
