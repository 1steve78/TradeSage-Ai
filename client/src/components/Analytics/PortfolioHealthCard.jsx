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
    <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 h-full group flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block group-hover:scale-105 transition-transform origin-left">
          Portfolio Health
        </h3>
        <ShieldCheck className={score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400"} size={28} />
      </div>

      <div className="flex items-end gap-2 mb-6 border-b border-slate-700/50 pb-6">
        <span className={`text-5xl font-extrabold ${score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400"}`}>
          {score}
        </span>
        <span className="text-slate-400 text-xl font-medium mb-1">/ 100</span>
      </div>

      <div className="flex-grow space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
            {rule.passed ? (
              <CheckCircle2 className="text-emerald-400 mt-0.5 shrink-0" size={18} />
            ) : (
              <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={18} />
            )}
            <span className={`text-sm ${rule.passed ? 'text-slate-200' : 'text-slate-300'}`}>
              {rule.passed ? rule.passText : rule.failText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioHealthCard;
