import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const PortfolioHealthCard = ({ summary, sectors, statistics }) => {
  if (!summary || !sectors || !statistics) return null;

  // Calculate scores
  const has4Sectors = sectors.length >= 4;
  const cashRatio = (summary.cash / summary.portfolioValue) * 100;
  const cashHealthy = cashRatio > 15;
  const roiPositive = summary.roi > 0;
  const winRateHealthy = statistics.winRate > 55;
  const noOverConcentration = sectors.every(s => parseFloat(s.percentage) < 50);

  let score = 0;
  if (has4Sectors) score += 20;
  if (cashHealthy) score += 20;
  if (roiPositive) score += 20;
  if (winRateHealthy) score += 20;
  if (noOverConcentration) score += 20;

  const rules = [
    { passed: has4Sectors, passText: "Good diversification (4+ sectors)", failText: "Low diversification (< 4 sectors)" },
    { passed: cashHealthy, passText: "Cash Reserve Healthy (>15%)", failText: "Low Cash Reserve (<15%)" },
    { passed: roiPositive, passText: "Positive ROI", failText: "Negative ROI" },
    { passed: winRateHealthy, passText: "Win Rate > 55%", failText: "Win Rate < 55%" },
    { passed: noOverConcentration, passText: "No Sector Over-concentration", failText: "High Sector Concentration (>50% in one)" }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded shadow-none h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-title-sm text-[#0f172a] font-bold">
          Portfolio Health
        </h3>
        <ShieldCheck className={score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600"} size={24} />
      </div>

      <div className="flex items-end gap-2 mb-6 border-b border-outline-variant/40 pb-6">
        <span className={`font-data-mono text-5xl font-extrabold ${score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600"}`}>
          {score}
        </span>
        <span className="font-data-mono text-slate-500 text-xl font-medium mb-1">/ 100</span>
      </div>

      <div className="flex-grow space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded border border-outline-variant">
            {rule.passed ? (
              <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={18} />
            ) : (
              <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
            )}
            <span className={`font-body-sm ${rule.passed ? 'text-[#0f172a]' : 'text-[#0f172a]'}`}>
              {rule.passed ? rule.passText : rule.failText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioHealthCard;
