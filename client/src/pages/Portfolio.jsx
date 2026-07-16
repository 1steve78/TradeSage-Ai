import { useEffect } from "react";
import usePortfolioStore from "../store/portfolioStore";
import useMarketStore from "../store/marketStore";

const Portfolio = () => {
  const { portfolio, fetchPortfolio } = usePortfolioStore();
  const prices = useMarketStore((state) => state.prices);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const cash = portfolio?.cash ?? 0;
  const holdings = portfolio?.holdings ?? [];
  const realizedPnL = portfolio?.totalPnL ?? 0;

  // 1. Calculate live totals
  let totalInvested = 0;
  let totalCurrentVal = 0;

  holdings.forEach((h) => {
    const livePrice = prices[h.symbol]?.price ?? h.averagePrice;
    totalInvested += h.averagePrice * h.quantity;
    totalCurrentVal += livePrice * h.quantity;
  });

  const totalPortfolioValue = cash + totalCurrentVal;
  const unrealizedPnL = totalCurrentVal - totalInvested;
  const netReturnPct = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;

  // 2. Sector Allocation calculations
  const getSector = (symbol) => {
    switch (symbol) {
      case "AAPL":
      case "MSFT":
      case "NVDA":
      case "GOOGL":
        return "Technology";
      case "TSLA":
        return "Automotive & Energy";
      case "BTC":
        return "Crypto Assets";
      case "AMZN":
        return "Consumer E-Commerce";
      default:
        return "Other Sector";
    }
  };

  const getSectorStyle = (sector) => {
    switch (sector) {
      case "Technology":
        return { icon: "apps", bg: "bg-primary-container text-white", color: "bg-primary" };
      case "Automotive & Energy":
        return { icon: "bolt", bg: "bg-amber-100 text-amber-800", color: "bg-amber-500" };
      case "Crypto Assets":
        return { icon: "currency_bitcoin", bg: "bg-indigo-100 text-indigo-800", color: "bg-indigo-500" };
      case "Consumer E-Commerce":
        return { icon: "local_mall", bg: "bg-emerald-100 text-emerald-800", color: "bg-emerald-500" };
      default:
        return { icon: "account_balance", bg: "bg-slate-100 text-slate-800", color: "bg-slate-500" };
    }
  };

  const sectorVal = {};
  let totalHoldingsVal = 0;

  holdings.forEach((h) => {
    const livePrice = prices[h.symbol]?.price ?? h.averagePrice;
    const val = livePrice * h.quantity;
    totalHoldingsVal += val;

    const sector = getSector(h.symbol);
    sectorVal[sector] = (sectorVal[sector] || 0) + val;
  });

  // Include cash as a sector if holdings are empty or to show complete asset split
  const sectors = Object.entries(sectorVal).map(([name, val]) => ({
    name,
    val,
    pct: totalPortfolioValue > 0 ? (val / totalPortfolioValue) * 100 : 0,
  })).sort((a, b) => b.val - a.val);

  // Add Cash to allocation breakdown if cash exists
  if (cash > 0 && totalPortfolioValue > 0) {
    sectors.push({
      name: "Cash Reserves",
      val: cash,
      pct: (cash / totalPortfolioValue) * 100,
    });
  }
  sectors.sort((a, b) => b.val - a.val);

  return (
    <div className="space-y-lg max-w-[1400px] mx-auto w-full font-sans">
      {/* Portfolio Metrics: Bento Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
        <div className="glass-card p-lg rounded-xl flex flex-col justify-between min-h-[110px]">
          <span className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Portfolio Value</span>
          <div className="mt-sm flex flex-col">
            <span className="font-display-lg text-lg font-bold font-data-mono text-[#0f172a]">
              ₹{totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-xs text-green-600 mt-1 font-bold text-xs">
              <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
              <span className="font-data-mono">+2.4% vs prev</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-lg rounded-xl flex flex-col justify-between border-l-4 border-l-primary min-h-[110px]">
          <span className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest font-bold">Today's Net Return</span>
          <div className="mt-sm flex flex-col">
            <span className={`font-display-lg text-lg font-bold font-data-mono ${
              unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              ₹{unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {totalInvested > 0 && (
              <span className="font-data-mono text-xs font-bold text-slate-500 mt-1">
                {unrealizedPnL >= 0 ? "+" : ""}{netReturnPct.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="glass-card p-lg rounded-xl flex flex-col justify-between min-h-[110px]">
          <span className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest font-bold">Realized P&amp;L</span>
          <div className="mt-sm flex flex-col">
            <span className={`font-display-lg text-lg font-bold font-data-mono ${
              realizedPnL >= 0 ? "text-[#0f172a]" : "text-red-600"
            }`}>
              ₹{realizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="bg-slate-900 text-white px-2 py-0.5 rounded inline-block mt-2 max-w-max">
              <span className="font-label-caps text-[9px] font-bold">BOOKED PROFIT</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-lg rounded-xl flex flex-col justify-between min-h-[110px]">
          <span className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest font-bold">Unrealized P&amp;L</span>
          <div className="mt-sm flex flex-col">
            <span className={`font-display-lg text-lg font-bold font-data-mono ${
              unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              ₹{unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="bg-secondary-container/40 text-slate-700 px-2 py-0.5 rounded inline-block mt-2 max-w-max border border-secondary-container">
              <span className="font-label-caps text-[9px] font-bold">FLOATING PNL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Benchmark Comparison Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-lg flex flex-col bg-white">
          <div className="flex justify-between items-start mb-lg border-b border-[#f2f4f6] pb-4">
            <div>
              <h2 className="font-title-sm text-sm text-[#0f172a] font-bold">Benchmark Performance</h2>
              <p className="font-body-sm text-[11px] text-slate-400 font-semibold mt-0.5">Comparative Alpha Analysis</p>
            </div>
            <div className="flex gap-sm">
              <div className="flex items-center gap-xs px-2.5 py-1 bg-surface-container rounded cursor-pointer text-[10px] font-bold text-[#0f172a]">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <span>PORTFOLIO</span>
              </div>
              <div className="flex items-center gap-xs px-2.5 py-1 hover:bg-surface-container rounded cursor-pointer transition-colors text-[10px] font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span>NIFTY 50</span>
              </div>
              <div className="flex items-center gap-xs px-2.5 py-1 hover:bg-surface-container rounded cursor-pointer transition-colors text-[10px] font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <span>S&amp;P 500</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex-1 min-h-[260px] w-full mt-auto flex items-end">
            {/* Grid Line lines simulation */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
              <div className="border-b border-[#cbd5e1] w-full"></div>
              <div className="border-b border-[#cbd5e1] w-full"></div>
              <div className="border-b border-[#cbd5e1] w-full"></div>
              <div className="border-b border-[#cbd5e1] w-full"></div>
            </div>
            
            {/* Simulated Chart Bars */}
            <div className="absolute inset-0 flex items-end gap-3 px-sm z-10">
              <div className="flex-1 bg-primary/10 h-[40%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/10 h-[45%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/10 h-[38%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/15 h-[52%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/10 h-[60%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/20 h-[58%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/10 h-[65%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/25 h-[75%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/30 h-[82%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/40 h-[90%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/35 h-[85%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
              <div className="flex-1 bg-primary/50 h-[100%] rounded-t-sm transition-all hover:bg-primary/20 cursor-pointer"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-b border-l border-outline-variant/30"></div>
            
            {/* Axis Labels */}
            <div className="absolute -bottom-6 left-0 w-full flex justify-between font-data-mono text-[9px] text-slate-400 font-semibold px-2">
              <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
            </div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="glass-card rounded-xl p-lg flex flex-col bg-white">
          <h2 className="font-title-sm text-sm text-[#0f172a] font-bold mb-lg border-b border-[#f2f4f6] pb-4">
            Asset Allocation
          </h2>
          <div className="relative aspect-square max-w-[180px] mx-auto mb-lg flex items-center justify-center">
            {/* Custom SVG Pie Visualization */}
            <svg className="w-full h-full drop-shadow-sm -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f2f4f6" strokeWidth="3" />
              {/* Render dynamic dashboard circles if sectors are loaded */}
              {sectors.map((sec, idx) => {
                let strokeOffset = 0;
                for (let i = 0; i < idx; i++) {
                  strokeOffset += sectors[i].pct;
                }
                const colorClass = sec.name === "Cash Reserves" ? "text-slate-300" : 
                                   sec.name === "Technology" ? "text-[#0f172a]" :
                                   sec.name === "Automotive & Energy" ? "text-amber-500" : 
                                   sec.name === "Crypto Assets" ? "text-indigo-500" : "text-emerald-500";
                return (
                  <circle
                    key={sec.name}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    className={colorClass}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${sec.pct} 100`}
                    strokeDashoffset={-strokeOffset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-data-mono text-xs font-bold text-[#0f172a]">100%</span>
              <span className="font-label-caps text-[8px] text-slate-400 font-bold tracking-widest mt-0.5">DIVERSIFIED</span>
            </div>
          </div>
          
          <div className="space-y-sm mt-auto border-t border-[#f2f4f6] pt-4 max-h-[140px] overflow-y-auto scroll-hide">
            {sectors.length > 0 ? (
              sectors.map((sec) => {
                const style = getSectorStyle(sec.name);
                return (
                  <div key={sec.name} className="flex justify-between items-center text-xs font-semibold">
                    <div className="flex items-center gap-sm">
                      <div className={`w-2 h-2 rounded-full ${style.color}`}></div>
                      <span className="text-slate-600">{sec.name}</span>
                    </div>
                    <span className="font-data-mono text-[#0f172a]">{sec.pct.toFixed(1)}%</span>
                  </div>
                );
              })
            ) : (
              <p className="text-[10px] text-slate-400 text-center py-4">No assets allocation records.</p>
            )}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card rounded-xl overflow-hidden bg-white border border-[#e2e8f0]">
        <div className="px-lg py-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-title-sm text-sm text-[#0f172a] font-bold">Current Holdings</h2>
          <div className="flex gap-md font-bold text-[10px] text-slate-400">
            <button className="flex items-center gap-xs hover:text-black transition cursor-pointer">
              <span className="material-symbols-outlined text-sm">filter_list</span> FILTER
            </button>
            <button className="flex items-center gap-xs hover:text-black transition cursor-pointer">
              <span className="material-symbols-outlined text-sm">download</span> EXPORT
            </button>
          </div>
        </div>
        
        <table className="w-full border-collapse font-sans text-left">
          <thead className="bg-surface-container-lowest text-left font-label-caps text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="px-lg py-sm border-b border-[#e2e8f0]">Asset</th>
              <th className="px-lg py-sm border-b border-[#e2e8f0]">Quantity</th>
              <th className="px-lg py-sm border-b border-[#e2e8f0] text-right">Avg Price</th>
              <th className="px-lg py-sm border-b border-[#e2e8f0] text-right">LTP</th>
              <th className="px-lg py-sm border-b border-[#e2e8f0] text-right">P&amp;L</th>
              <th className="px-lg py-sm border-b border-[#e2e8f0] text-right">Allocation</th>
            </tr>
          </thead>
          <tbody className="text-xs font-semibold">
            {holdings.length > 0 ? (
              holdings.map((h) => {
                const livePrice = prices[h.symbol]?.price ?? h.averagePrice;
                const value = livePrice * h.quantity;
                const cost = h.averagePrice * h.quantity;
                const pnl = value - cost;
                const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
                
                const allocPct = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;
                const sector = getSector(h.symbol);
                const style = getSectorStyle(sector);

                return (
                  <tr key={h.symbol} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md border-b border-outline-variant/30">
                      <div className="flex items-center gap-sm">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${style.bg}`}>
                          <span className="material-symbols-outlined text-sm font-bold">{style.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#0f172a]">{h.companyName}</p>
                          <p className="text-[10px] font-data-mono text-slate-400 uppercase">{h.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md border-b border-outline-variant/30 font-data-mono text-slate-700">
                      {h.quantity} Shares
                    </td>
                    <td className="px-lg py-md border-b border-outline-variant/30 text-right font-data-mono text-slate-700">
                      ₹{h.averagePrice.toFixed(2)}
                    </td>
                    <td className="px-lg py-md border-b border-outline-variant/30 text-right font-data-mono text-[#0f172a]">
                      ₹{livePrice.toFixed(2)}
                    </td>
                    <td className="px-lg py-md border-b border-outline-variant/30 text-right">
                      <span className={`font-data-mono ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                      </span>
                      <p className={`text-[10px] font-data-mono ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {pnl >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%
                      </p>
                    </td>
                    <td className="px-lg py-md border-b border-outline-variant/30 text-right align-middle">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-data-mono text-[10px] text-slate-500">{allocPct.toFixed(0)}%</span>
                        <div className="w-16 bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${style.color}`} style={{ width: `${allocPct}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs text-slate-400 font-medium">
                  No active holdings. Place orders on the Dashboard to build your portfolio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
