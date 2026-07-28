import React from "react";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

/**
 * ConfidenceBadge Component
 *
 * Visual indicator showing evidence strength ("High", "Medium", "Low")
 * backing an AI explanation.
 */
export const ConfidenceBadge = ({ confidence = "Low" }) => {
  const normalized = (confidence || "Low").trim();

  const config = {
    High: {
      label: "High Confidence",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: ShieldCheck,
    },
    Medium: {
      label: "Medium Confidence",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Shield,
    },
    Low: {
      label: "Low Confidence",
      bg: "bg-slate-100 text-slate-600 border-slate-200",
      icon: ShieldAlert,
    },
  }[normalized] || {
    label: `${confidence} Confidence`,
    bg: "bg-slate-100 text-slate-600 border-slate-200",
    icon: ShieldAlert,
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${config.bg}`}
      title="Confidence score is calculated based on available news articles and source diversity."
    >
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export default ConfidenceBadge;
