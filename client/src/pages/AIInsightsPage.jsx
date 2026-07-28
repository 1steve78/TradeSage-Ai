import React, { useState, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  PieChart, 
  Brain, 
  ShieldAlert, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Lightbulb, 
  Zap, 
  Clock, 
  Activity,
  ArrowUpRight,
  Sliders,
  Layers
} from "lucide-react";
import { useMarketPulse, useRefreshMarketPulse } from "../hooks/useAI";
import { getPortfolioIntelligence } from "../api/aiApi";
import usePortfolioStore from "../store/portfolioStore";
import useTradingStore from "../store/tradingStore";
import PortfolioHealthWidget from "../components/AI/PortfolioHealthWidget";
import RiskAlertsWidget from "../components/AI/RiskAlertsWidget";
import InsightHistory from "../components/AI/InsightHistory";
import NewsDashboard from "../components/News/NewsDashboard";

const AIInsightsPage = () => {
  const { data: pulseResponse, isLoading: pulseLoading, refetch: refetchPulse, isFetching: pulseFetching } = useMarketPulse();
  const refreshPulseMutation = useRefreshMarketPulse();

  const { portfolio, fetchPortfolio } = usePortfolioStore();
  const { openModal, setSelectedStock } = useTradingStore();

  const [intelligence, setIntelligence] = useState(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [gaugeAngle, setGaugeAngle] = useState(35); // Degrees rotation for gauge needle
  const [rebalancingSuccess, setRebalancingSuccess] = useState(false);
  const [diversifySuccess, setDiversifySuccess] = useState(false);

  const pulseData = pulseResponse?.data;
  const isRefreshing = pulseFetching || refreshPulseMutation.isPending;

  // Fetch portfolio intelligence data from API
  const fetchIntelligenceData = useCallback(async (forceRefresh = false) => {
    try {
      setIntelLoading(true);
      const res = await getPortfolioIntelligence(forceRefresh);
      if (res.success && res.data) {
        setIntelligence(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio intelligence:", err);
    } finally {
      setIntelLoading(false);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    fetchIntelligenceData();
  }, [fetchPortfolio, fetchIntelligenceData]);

  // Gauge animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Bullish sentiment score angle (0° is left, 90° top, 180° right)
      setGaugeAngle(42); 
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleGlobalRefresh = async () => {
    await refreshPulseMutation.mutateAsync({ forceRefresh: true });
    await fetchIntelligenceData(true);
  };

  const handleInitiateRebalance = () => {
    setRebalancingSuccess(true);
    setTimeout(() => setRebalancingSuccess(false), 4000);
  };

  const handleDiversifyNow = () => {
    setDiversifySuccess(true);
    setTimeout(() => setDiversifySuccess(false), 4000);
  };

  const handleQuickTrade = (symbol, companyName) => {
    setSelectedStock({ symbol, companyName });
    openModal("BUY");
  };

  const aiPicks = [
    { symbol: "NVDA", name: "NVIDIA Corp.", code: "NV", strategy: "Momentum Alpha", conf: 94, target: "$915.20" },
    { symbol: "AMZN", name: "Amazon.com Inc.", code: "AM", strategy: "Deep Value Recovery", conf: 81, target: "$188.50" },
    { symbol: "MSFT", name: "Microsoft Corp.", code: "MS", strategy: "Cloud Growth Surge", conf: 88, target: "$450.00" },
    { symbol: "AAPL", name: "Apple Inc.", code: "AP", strategy: "Ecosystem Rebound", conf: 76, target: "$235.00" },
  ];

  const renderSummaryText = (text) => {
    if (!text) {
      return (
        <div className="space-y-3 text-sm leading-relaxed text-[#191c1e]">
          <p className="font-body-md leading-relaxed text-[#191c1e]">
            Today's market declined by <span className="font-bold text-slate-900">1.2%</span> due to unexpected inflation data and weakness in the banking sector. The CPI release showed a 0.2% variance above consensus, triggering immediate yield curve adjustments.
          </p>
          <p className="font-body-md leading-relaxed text-slate-600 italic border-l-4 border-[#c6c6cd] pl-4 py-1">
            "The intersection of rising labor costs and the regional banking liquidity crunch has created a short-term resistance level at 4,450 points. Expect volatility to remain elevated until the FOMC minutes are released."
          </p>
        </div>
      );
    }

    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    return (
      <div className="space-y-2 text-sm leading-relaxed text-[#191c1e]">
        {lines.map((line, idx) => {
          if (line.includes("🧠") || line.toLowerCase().includes("summary:")) {
            return (
              <h4 key={idx} className="font-bold text-[#0f172a] text-sm flex items-center gap-1.5 pt-1">
                {line.replace(/^#+\s*/, "")}
              </h4>
            );
          }
          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            return (
              <div key={idx} className="flex items-start gap-2 bg-[#f2f4f6] p-2.5 rounded border border-[#e2e8f0]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <p className="text-slate-700 text-xs font-medium">{line.replace(/^[•\-]\s*/, "")}</p>
              </div>
            );
          }
          return (
            <p key={idx} className="text-slate-700 text-xs font-medium bg-[#f2f4f6] p-2.5 rounded border border-[#e2e8f0]">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto pb-12 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e2e8f0] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              AI Intelligence Hub
            </h1>
            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-1">
              <Zap size={10} className="text-emerald-400" /> Pro Edition
            </span>
          </div>
          <p className="font-body-md text-sm text-slate-500 font-medium">
            Real-time proprietary analytics and neural-driven market synthesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e2e8f0] rounded text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-label-caps text-[11px] font-bold text-slate-700">System Status: Optimal</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e2e8f0] rounded text-xs">
            <span className="font-data-mono text-[11px] text-slate-500">Last Sync: {lastSync} GMT</span>
          </div>
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing || intelLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded font-bold text-xs transition cursor-pointer disabled:opacity-50"
            title="Refresh All AI Models"
          >
            <RefreshCw size={14} className={isRefreshing || intelLoading ? "animate-spin" : ""} />
            <span>{isRefreshing || intelLoading ? "Analyzing..." : "Refresh Insights"}</span>
          </button>
        </div>
      </div>

      {/* Rebalance / Diversify Action Toasts */}
      {rebalancingSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Rebalancing order parameters compiled and submitted to SmartOrder router.
        </div>
      )}
      {diversifySuccess && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-blue-600" />
          Sector diversification strategy triggered. Recommendations staged in order basket.
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

        {/* 1. Market Pulse (Narrative Insight) - 8 Columns */}
        <div className="md:col-span-8 bg-white border border-[#e2e8f0] rounded p-6 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-start mb-4 border-b border-[#f2f4f6] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded text-[#0f172a]">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="font-headline-md text-base font-bold text-[#0f172a]">Market Pulse</h2>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">NVIDIA NIM Neural Synthesis</span>
                </div>
              </div>
              <span className="font-data-mono text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-100">
                <TrendingDown size={14} />
                -1.24% Intraday
              </span>
            </div>

            {pulseLoading ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw size={24} className="animate-spin mx-auto text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">Compiling real-time market pulse data...</p>
              </div>
            ) : (
              renderSummaryText(pulseData?.summary)
            )}
          </div>

          {/* Mini Bar Chart Mock Visualization */}
          <div className="mt-6">
            <div className="h-20 w-full bg-[#f8fafc] rounded overflow-hidden border border-[#e2e8f0] relative p-3 flex items-end">
              <div className="flex gap-1.5 h-full items-end w-full">
                <div className="flex-1 bg-slate-300 hover:bg-slate-400 transition-colors h-[60%] rounded-t-xs" title="09:30 AM" />
                <div className="flex-1 bg-slate-300 hover:bg-slate-400 transition-colors h-[75%] rounded-t-xs" title="10:30 AM" />
                <div className="flex-1 bg-slate-300 hover:bg-slate-400 transition-colors h-[40%] rounded-t-xs" title="11:30 AM" />
                <div className="flex-1 bg-slate-300 hover:bg-slate-400 transition-colors h-[85%] rounded-t-xs" title="12:30 PM" />
                <div className="flex-1 bg-slate-300 hover:bg-slate-400 transition-colors h-[55%] rounded-t-xs" title="01:30 PM" />
                <div className="flex-1 bg-slate-300 hover:bg-slate-400 transition-colors h-[35%] rounded-t-xs" title="02:30 PM" />
                <div className="flex-1 bg-red-400 hover:bg-red-500 transition-colors h-[90%] rounded-t-xs" title="CPI Data Impact" />
                <div className="flex-1 bg-red-500 hover:bg-red-600 transition-colors h-[95%] rounded-t-xs" title="Current Close" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-data-mono text-slate-400 mt-1">
              <span>09:30 EST</span>
              <span>12:00 EST</span>
              <span>16:00 EST</span>
            </div>
          </div>
        </div>

        {/* 2. Sentiment Analysis (Gauge) - 4 Columns */}
        <div className="md:col-span-4 bg-white border border-[#e2e8f0] rounded p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#f2f4f6] pb-3">
              <div className="p-1.5 bg-slate-100 rounded text-[#0f172a]">
                <Brain size={20} />
              </div>
              <h2 className="font-headline-md text-base font-bold text-[#0f172a]">Market Sentiment</h2>
            </div>

            {/* Sentiment Arc Dial */}
            <div className="relative py-4 flex flex-col items-center">
              <div className="relative w-44 h-22 overflow-hidden">
                {/* Arc Background Track */}
                <div className="absolute top-0 left-0 w-44 h-44 border-[16px] border-[#eceef0] rounded-full" />
                {/* Active Colored Arc */}
                <div className="absolute top-0 left-0 w-44 h-44 border-[16px] border-transparent border-r-emerald-500 border-t-emerald-500 rounded-full rotate-45 transform-gpu transition-transform duration-1000" />
                {/* Dial Needle */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-18 bg-black origin-bottom rounded-full transition-transform duration-1000 shadow-md"
                  style={{ transform: `translateX(-50%) rotate(${gaugeAngle}deg)` }}
                />
              </div>

              <div className="text-center mt-3">
                <span className="font-display-lg text-2xl font-black text-emerald-600 block leading-tight">
                  Bullish
                </span>
                <span className="font-label-caps text-xs text-slate-500 font-bold font-data-mono">
                  Sentiment Score: 72/100
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f4f6] p-3 rounded border border-[#e2e8f0] text-xs text-slate-700 italic">
            <span className="font-bold text-[#0f172a] not-italic block mb-0.5">AI Synthesis Note:</span>
            Retail volume is surging in large-cap tech while institutional shorts are covering.
          </div>
        </div>

        {/* 3. Portfolio Exposure (Analysis) - 6 Columns */}
        <div className="md:col-span-6 bg-white border border-[#e2e8f0] rounded p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#f2f4f6] pb-3">
              <div className="p-1.5 bg-slate-100 rounded text-[#0f172a]">
                <PieChart size={20} />
              </div>
              <h2 className="font-headline-md text-base font-bold text-[#0f172a]">Portfolio Exposure</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-title-sm text-xs font-bold text-slate-700">Banking & Financial Sector</span>
                  <span className="font-data-mono text-sm font-bold text-[#0f172a]">52%</span>
                </div>
                <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0f172a] w-[52%] transition-all duration-700" />
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-blue-50/60 border border-blue-200/80 rounded">
                <Lightbulb size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-body-sm text-xs text-blue-900 font-bold mb-0.5">Rebalance Suggested</p>
                  <p className="font-body-sm text-xs text-blue-800 leading-relaxed">
                    Reducing exposure to 35% would align with your moderate risk profile and current market volatility in financials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleInitiateRebalance}
            className="mt-6 w-full py-2.5 border border-[#0f172a] bg-white hover:bg-black hover:text-white text-[#0f172a] font-label-caps text-xs font-bold tracking-widest transition-all rounded cursor-pointer"
          >
            INITIATE REBALANCE
          </button>
        </div>

        {/* 4. Risk Alert (Critical) - 6 Columns */}
        <div className="md:col-span-6 bg-white border-l-4 border-l-red-600 border-[#e2e8f0] border rounded p-6 flex flex-col justify-between shadow-xs bg-red-50/10">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#f2f4f6] pb-3">
              <div className="p-1.5 bg-red-100 rounded text-red-700">
                <ShieldAlert size={20} />
              </div>
              <h2 className="font-headline-md text-base font-bold text-red-700">Risk Alert</h2>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded">
                <h3 className="font-title-sm text-xs font-bold text-red-900 mb-1">High Concentration Detected</h3>
                <p className="font-body-md text-xs text-red-800 leading-relaxed mb-3">
                  You have invested heavily in the IT sector (<span className="font-data-mono font-bold">64.0%</span> of total equity). This exceeds your defined risk threshold by 24 points.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-2.5 border border-red-200 rounded">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Max Threshold</span>
                    <span className="font-data-mono text-sm font-bold text-slate-800">40.0%</span>
                  </div>
                  <div className="bg-white p-2.5 border border-red-200 rounded">
                    <span className="block text-[10px] font-bold text-red-600 uppercase">Current Allocation</span>
                    <span className="font-data-mono text-sm font-bold text-red-600">64.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Urgency: Critical</span>
            <button
              onClick={handleDiversifyNow}
              className="bg-red-600 text-white px-4 py-2 font-label-caps text-xs font-bold rounded hover:bg-red-700 transition cursor-pointer shadow-sm"
            >
              DIVERSIFY NOW
            </button>
          </div>
        </div>

        {/* 5. Deterministic Portfolio Health & Alerts - 12 Columns */}
        <div className="md:col-span-12">
          <PortfolioHealthWidget health={intelligence?.health} />
        </div>

        {/* 6. Supplementary Asset Performance Card Table - 12 Columns */}
        <div className="md:col-span-12 bg-white border border-[#e2e8f0] rounded overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-slate-800" />
              <span className="font-title-sm text-sm font-bold text-[#0f172a]">Top AI Model Stock Picks</span>
            </div>
            <button className="text-xs font-bold text-[#0f172a] hover:underline cursor-pointer">
              View All Models & Strategies →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f2f4f6] border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-6 py-3 font-label-caps text-xs text-[#0f172a] font-bold uppercase">Asset</th>
                  <th className="px-6 py-3 font-label-caps text-xs text-[#0f172a] font-bold uppercase">Strategy</th>
                  <th className="px-6 py-3 font-label-caps text-xs text-[#0f172a] font-bold uppercase">Conf. Score</th>
                  <th className="px-6 py-3 font-label-caps text-xs text-[#0f172a] font-bold uppercase">Target</th>
                  <th className="px-6 py-3 font-label-caps text-xs text-[#0f172a] font-bold uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6] text-xs">
                {aiPicks.map((pick) => (
                  <tr key={pick.symbol} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-xs font-mono">
                        {pick.code}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0f172a]">{pick.symbol}</div>
                        <div className="text-xs text-slate-500">{pick.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{pick.strategy}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-data-mono font-bold text-slate-900">{pick.conf}%</span>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${pick.conf}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-data-mono font-bold text-[#0f172a]">{pick.target}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleQuickTrade(pick.symbol, pick.name)}
                        className="text-[#0f172a] border border-[#0f172a] hover:bg-black hover:text-white px-3 py-1 rounded text-xs font-bold transition cursor-pointer"
                      >
                        Trade Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Insight History Drawer */}
        <div className="md:col-span-12">
          <InsightHistory />
        </div>

        {/* 8. Institutional News Dashboard */}
        <div className="md:col-span-12 pt-6">
          <NewsDashboard />
        </div>

      </div>
    </div>
  );
};

export default AIInsightsPage;
