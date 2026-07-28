import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─── Design Tokens (from design-system.md) ─────────────────── */
const T = {
  // Surfaces
  bg:          "#f7f9fb",   // global floor
  surface:     "#ffffff",   // cards / work surfaces
  surfaceLow:  "#f2f4f6",   // containers / sidebars
  surfaceHigh: "#e6e8ea",   // chip backgrounds

  // Typography
  ink:         "#191c1e",   // primary text
  inkMuted:    "#45464d",   // secondary text
  inkFaint:    "#76777d",   // tertiary / captions

  // Borders
  border:      "#c6c6cd",   // standard 1px border
  borderFocus: "#000000",   // focus / active border

  // Brand
  primary:     "#000000",
  onPrimary:   "#ffffff",
  primaryDim:  "#131b2e",   // dark container

  // Semantic
  positive:    "#10b981",
  negative:    "#ef4444",

  // Typography families
  sans:   "'Hanken Grotesk', sans-serif",
  mono:   "'JetBrains Mono', monospace",
};

/* ─── Ticker data ───────────────────────────────────────────── */
const TICKER = [
  { symbol: "NIFTY 50",   price: "22,453.20", change: "-0.45%",  pos: false },
  { symbol: "SENSEX",     price: "74,119.55", change: "+0.12%",  pos: true  },
  { symbol: "RELIANCE",   price: "2,945.00",  change: "+1.23%",  pos: true  },
  { symbol: "HDFCBANK",   price: "1,420.15",  change: "-0.88%",  pos: false },
  { symbol: "INFY",       price: "1,602.40",  change: "+0.55%",  pos: true  },
  { symbol: "TATASTEEL",  price: "154.30",    change: "-1.12%",  pos: false },
  { symbol: "SBI",        price: "782.10",    change: "+2.10%",  pos: true  },
  { symbol: "WIPRO",      price: "490.65",    change: "+0.31%",  pos: true  },
  { symbol: "ICICIBANK",  price: "1,084.90",  change: "-0.67%",  pos: false },
];

/* ─── Features ──────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "currency_exchange",
    title: "Paper Trading",
    desc: "Execute trades in a risk-free virtual environment. Full order types — market, limit, SL — with real-time price execution.",
  },
  {
    icon: "monitoring",
    title: "Portfolio IQ",
    desc: "Deep analytics on your holdings: sector exposure, P&L attribution, risk metrics, and benchmark comparison.",
  },
  {
    icon: "psychology",
    title: "AI Copilot",
    desc: "Ask questions in plain language. Get portfolio analysis, stock summaries, and macro briefings instantly.",
  },
  {
    icon: "newspaper",
    title: "News Intelligence",
    desc: "Real-time sentiment scoring across thousands of sources, filtered to stocks in your watchlist.",
  },
  {
    icon: "candlestick_chart",
    title: "Professional Charts",
    desc: "Institutional-grade charting with 50+ indicators, multi-timeframe analysis, and drawing tools.",
  },
  {
    icon: "notifications_active",
    title: "Smart Alerts",
    desc: "Price triggers, volume spikes, and AI-generated signals delivered the moment they occur.",
  },
];

/* ─── AI Prompts ────────────────────────────────────────────── */
const PROMPTS = [
  {
    q: "Why did my portfolio fall 2% today despite NIFTY being flat?",
    a: "Your HDFC exposure was affected by localised volatility in the private banking sector. While NIFTY remained stable, sectoral rotation into IT caused a relative lag in your holdings. Beta sensitivity: 1.14.",
    tag: "Portfolio Analysis",
  },
  {
    q: "Show me stocks with a positive MACD crossover on the 15m chart.",
    a: "4 matches found: RELIANCE (₹2,945), INFY (₹1,602), TATASTEEL (₹154.30), ICICIBANK (₹1,085). Volume confirmation detected on RELIANCE and INFY. Signal confidence: 94.2%.",
    tag: "Technical Screening",
  },
  {
    q: "Summarize the impact of the latest RBI policy on bank stocks.",
    a: "RBI held repo at 6.50% with a balanced stance — positive for NIMs. HDFCBANK and ICICIBANK show strong LCR ratios. Market impact assessed as moderately bullish for private banks.",
    tag: "Macro Summary",
  },
];

/* ─── Stats ─────────────────────────────────────────────────── */
const STATS = [
  { value: "50+",   label: "Indian Stocks" },
  { value: "10+",   label: "AI Tools" },
  { value: "100%",  label: "Risk-Free" },
  { value: "<50ms", label: "Data Latency" },
];

/* ─── How It Works ──────────────────────────────────────────── */
const HOW = [
  { n: "01", title: "Connect",  body: "Link to live NSE & BSE feeds. The same institutional data used by professional desks, updated in real time." },
  { n: "02", title: "Analyse",  body: "Our AI engine reads order books, news, technical signals, and macro indicators simultaneously, 24/7." },
  { n: "03", title: "Trade",    body: "Execute paper trades with full P&L tracking. Get AI feedback that turns every trade into a learning moment." },
];

/* ─── FAQ ────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Is paper trading free?",             a: "Yes — always. The paper trading core will never be paywalled. We believe every investor deserves a safe environment to practise." },
  { q: "How accurate is the real-time data?", a: "Data is sourced from Tier-1 exchange-connected providers. Price updates reflect the same feeds used by institutional terminals." },
  { q: "What makes the AI Copilot different?", a: "It is fine-tuned specifically for Indian markets — trained on technical indicators, regulatory filings, and institutional news feeds, not generic web text." },
  { q: "Is this suitable for beginners?",    a: "Absolutely. Paper trading eliminates financial risk, and the AI explains every concept in plain language. Most users become confident within 30 days." },
];

/* ══════════════════════════════════════════════════════════════
   Root component
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [activePrompt, setActivePrompt] = useState(0);

  /* Scroll-reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const smooth = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: T.bg, color: T.ink, fontFamily: T.sans, overflowX: "hidden", minHeight: "100vh", paddingBottom: 56 }}>

      {/* ── Ticker ──────────────────────────────────────────── */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ margin: "0 28px", fontFamily: T.mono, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <span style={{ color: "#b7c8e1", fontWeight: 600 }}>{t.symbol}</span>
              {" "}<span style={{ color: "#fff" }}>{t.price}</span>
              {" "}<span style={{ color: t.pos ? T.positive : T.negative, fontWeight: 600 }}>({t.change})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(247,249,251,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, background: T.primary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 16 }}>trending_up</span>
            </div>
            <span style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 800, letterSpacing: "-0.03em", color: T.primary }}>TradeSage AI</span>
          </Link>

          <nav style={{ display: "flex", gap: 32 }}>
            {[["Features","#features"],["How it Works","#how"],["AI Copilot","#copilot"],["FAQ","#faq"]].map(([l,h]) => (
              <a key={l} href={h} onClick={(e) => smooth(e, h)}
                style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.inkMuted, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = T.primary}
                onMouseLeave={e => e.target.style.color = T.inkMuted}
              >{l}</a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/auth" style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.inkMuted, textDecoration: "none", padding: "6px 14px" }}>Login</Link>
            <Btn to="/auth">Get Started</Btn>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="reveal-up" style={{ padding: "72px 0 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 10px", marginBottom: 20, background: T.surface }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: T.inkFaint }}>auto_awesome</span>
              <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkFaint }}>Co-Pilot 2.0 Live</span>
            </div>

            <h1 style={{ fontFamily: T.sans, fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, color: T.primary, margin: "0 0 16px" }}>
              AI-Powered Paper Trading &amp;{" "}
              <span style={{ color: T.inkMuted }}>Investment Research</span>
            </h1>

            <p style={{ fontFamily: T.sans, fontSize: 16, lineHeight: 1.7, color: T.inkMuted, margin: "0 0 28px", maxWidth: 480 }}>
              Master the Indian markets without capital risk. Institutional-grade tools — real-time data, AI insights, and deep portfolio analytics — built for the retail investor.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn to="/auth">Start Free Trading</Btn>
              <BtnOutline href="#features" onClick={(e) => smooth(e, "#features")}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>explore</span>
                Explore Features
              </BtnOutline>
            </div>

            {/* Micro-stats row */}
            <div style={{ display: "flex", gap: 24, marginTop: 36, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 700, color: T.primary }}>{value}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 12, color: T.inkFaint, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal screenshot */}
          <div>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden", background: T.surface }}>
              {/* Fake browser chrome */}
              <div style={{ background: T.surfaceLow, padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "3px 10px", marginLeft: 8 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkFaint }}>app.tradesage.ai/dashboard</span>
                </div>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZH5K1H_C2V7LUHUD6gMTxhzo2CPwiHjOqK-aLSk-abiTw_igjw4Tc6B7CEANK6Kf5BvXFUHQd7ZzXBe0q2a0BE7EbceozGUE_lJ65ba3lFAHM0qkPV84JxW-Bh8XvAEw4_own6SofTecfFFq7XLoqZckC_cZ8K5UL7qMqbpv_bXIjdIiBmA3W1fQsCW1N9WWZQXvvGlJyXFJ91frW_in_naUUdCY-Mt1QepfU-qrHPSGAWkw9VufI0dKNKxMAj5_4WAH-EDegW7k"
                alt="TradeSage AI Dashboard"
                style={{ width: "100%", display: "block" }}
              />
            </div>

            {/* Alert strip below screenshot */}
            <div style={{ border: `1px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 4px 4px", background: T.surface, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: T.positive }}>bolt</span>
              <span style={{ fontFamily: T.sans, fontSize: 12, fontStyle: "italic", color: T.inkMuted }}>
                "Reliance is entering a high-volume breakout zone — 84% bullish on institutional feeds."
              </span>
              <span style={{ marginLeft: "auto", fontFamily: T.mono, fontSize: 10, color: T.positive, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "2px 8px", whiteSpace: "nowrap", fontWeight: 600 }}>AI ALERT</span>
            </div>
          </div>
        </section>

        {/* ── Tech stack strip ────────────────────────────────── */}
        <section className="reveal-up" style={{ padding: "28px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkFaint, flexShrink: 0, marginRight: 8 }}>Built with</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            {["React", "Node.js", "MongoDB", "Vite", "OpenAI", "Socket.io", "Express"].map((t) => (
              <span key={t} style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 500, color: T.inkFaint, padding: "4px 10px", border: `1px solid ${T.border}`, borderRadius: 4, background: T.surface }}>{t}</span>
            ))}
          </div>
        </section>

        {/* ── Features grid ────────────────────────────────────── */}
        <section id="features" className="reveal-up" style={{ padding: "72px 0" }}>
          <SectionLabel>Platform Capabilities</SectionLabel>
          <h2 style={H2}>Institutional Tools, Zero Capital Risk</h2>
          <p style={{ ...Body, maxWidth: 560, marginBottom: 36 }}>
            Every feature is purpose-built for the Indian market — from NSE/BSE data feeds to SEBI-compliant risk frameworks.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden" }}>
            {FEATURES.map(({ icon, title, desc }, i) => (
              <FeatureCell key={title} icon={icon} title={title} desc={desc} last={i >= 3} />
            ))}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────── */}
        <section id="how" className="reveal-up" style={{ padding: "0 0 72px" }}>
          <SectionLabel>Process</SectionLabel>
          <h2 style={H2}>From Data to Decision in Three Steps</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden", marginTop: 36 }}>
            {HOW.map(({ n, title, body }, i) => (
              <div key={n} style={{
                padding: "32px 28px",
                background: T.surface,
                borderRight: i < HOW.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <div style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: T.inkFaint, marginBottom: 16 }}>STEP {n}</div>
                <h3 style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: T.primary, margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontFamily: T.sans, fontSize: 14, color: T.inkMuted, lineHeight: 1.65, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Copilot ───────────────────────────────────────── */}
        <section id="copilot" className="reveal-up" style={{ padding: "0 0 72px" }}>
          <SectionLabel>Flagship Feature</SectionLabel>
          <h2 style={H2}>AI Investment Copilot</h2>
          <p style={{ ...Body, maxWidth: 560, marginBottom: 36 }}>
            Ask any question about your portfolio or the market in plain English. Get institutional-grade analysis instantly.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden" }}>
            {/* Left — prompt list */}
            <div style={{ borderRight: `1px solid ${T.border}` }}>
              <div style={{ padding: "12px 16px", background: T.surfaceLow, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkFaint }}>Sample Queries</span>
              </div>
              {PROMPTS.map((p, i) => (
                <button key={i} onClick={() => setActivePrompt(i)} style={{
                  width: "100%", textAlign: "left", display: "block",
                  padding: "16px 20px",
                  background: activePrompt === i ? T.surfaceLow : T.surface,
                  borderBottom: `1px solid ${T.border}`,
                  borderLeft: activePrompt === i ? `2px solid ${T.primary}` : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <span style={{ fontFamily: T.sans, fontSize: 13, fontStyle: "italic", color: activePrompt === i ? T.primary : T.inkMuted, lineHeight: 1.5, display: "block" }}>"{p.q}"</span>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.inkFaint, marginTop: 4, display: "block", letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.tag}</span>
                </button>
              ))}
            </div>

            {/* Right — response */}
            <div style={{ background: T.surface }}>
              <div style={{ padding: "12px 16px", background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: T.inkFaint }}>psychology</span>
                <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkFaint }}>AI Response</span>
                <span style={{ marginLeft: "auto", fontFamily: T.mono, fontSize: 10, background: T.surfaceHigh, color: T.inkFaint, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T.border}` }}>{PROMPTS[activePrompt].tag}</span>
              </div>
              <div style={{ padding: "24px 20px" }}>
                <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.7, margin: "0 0 20px" }}>{PROMPTS[activePrompt].a}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to="/auth" style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.onPrimary, background: T.primary, padding: "7px 14px", borderRadius: 4, textDecoration: "none" }}>View Full Report</Link>
                  <Link to="/auth" style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 500, color: T.inkMuted, background: "transparent", padding: "7px 14px", borderRadius: 4, textDecoration: "none", border: `1px solid ${T.border}` }}>Open Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why TradeSage ────────────────────────────────────── */}
        <section className="reveal-up" style={{ padding: "0 0 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <SectionLabel>Value Proposition</SectionLabel>
              <h2 style={H2}>Built for Intelligence, Not Just Execution</h2>
              <p style={{ ...Body, marginBottom: 32 }}>
                Traditional broking platforms are built for order routing. TradeSage is built to help you <strong style={{ color: T.primary }}>think better, learn faster, and trade with conviction</strong>.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden" }}>
                {[
                  { icon: "shield",               label: "Practice Without Risk",      sub: "Live market data. Zero capital at stake." },
                  { icon: "rocket_launch",         label: "Learn Faster with AI",       sub: "Mistakes become insights, not losses." },
                  { icon: "workspace_premium",     label: "Institutional-Grade Tools",  sub: "Tools previously reserved for hedge funds." },
                  { icon: "notifications_active",  label: "Never Miss a Signal",        sub: "AI-driven alerts, news, and triggers." },
                ].map(({ icon, label, sub }, i, arr) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", background: T.surface }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: T.inkFaint, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <div>
                      <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.primary }}>{label}</div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.inkMuted, marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>By the Numbers</SectionLabel>
              <h2 style={H2}>Trusted by Traders Across India</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden", marginTop: 28 }}>
                {[
                  { v: "15,000+",  l: "Active Traders" },
                  { v: "₹480 Cr+", l: "Virtual Volume Traded" },
                  { v: "50+",      l: "Stocks Covered" },
                  { v: "10+",      l: "AI Analysis Modules" },
                  { v: "< 50ms",   l: "Data Latency" },
                  { v: "100%",     l: "Risk-Free" },
                ].map(({ v, l }, i, arr) => (
                  <div key={l} style={{
                    padding: "24px 20px", background: T.surface,
                    borderBottom: i < arr.length - 2 ? `1px solid ${T.border}` : "none",
                    borderRight: i % 2 === 0 ? `1px solid ${T.border}` : "none",
                  }}>
                    <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 700, color: T.primary, letterSpacing: "-0.01em" }}>{v}</div>
                    <div style={{ fontFamily: T.sans, fontSize: 12, color: T.inkFaint, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Coming soon */}
              <div style={{ marginTop: 20, border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: T.surfaceLow, borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkFaint }}>Roadmap</span>
                </div>
                {[["Broker Integration","One-click live execution from research"],["Mobile Terminal","Full-featured iOS & Android apps"],["Strategy Backtesting","10 years of historical tick data"]].map(([title, desc], i, arr) => (
                  <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", background: T.surface }}>
                    <div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.ink }}>{title}</div>
                      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.inkFaint }}>{desc}</div>
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: T.surfaceHigh, color: T.inkFaint, padding: "3px 8px", borderRadius: 4, border: `1px solid ${T.border}`, flexShrink: 0, marginLeft: 12 }}>Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="reveal-up" style={{ padding: "0 0 72px", maxWidth: 720, margin: "0 auto 0" }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ ...H2, textAlign: "center" }}>Common Questions</h2>

          <div style={{ border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden", marginTop: 28 }}>
            {FAQS.map(({ q, a }, i) => (
              <details key={q} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${T.border}` : "none" }}
                onToggle={e => {
                  const summary = e.currentTarget.querySelector("summary");
                  if (summary) summary.style.background = e.currentTarget.open ? T.surfaceLow : T.surface;
                }}
              >
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", background: T.surface, transition: "background 0.15s" }}>
                  <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.primary }}>{q}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: T.inkFaint, flexShrink: 0, marginLeft: 12 }}>expand_more</span>
                </summary>
                <div style={{ padding: "16px 20px", fontFamily: T.sans, fontSize: 14, color: T.inkMuted, lineHeight: 1.7, background: T.surface, borderTop: `1px solid ${T.border}` }}>{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="reveal-up" style={{ paddingBottom: 72 }}>
          <div style={{ background: T.primaryDim, color: "#fff", borderRadius: 4, padding: "56px 48px", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", border: `1px solid #1e2a40` }}>
            <div>
              <h2 style={{ fontFamily: T.sans, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
                Start Building Your Investing Skills Today
              </h2>
              <p style={{ fontFamily: T.sans, fontSize: 15, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                No credit card required. Join 15,000+ traders already using TradeSage AI.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <Link to="/auth" style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.primary, background: "#fff", padding: "10px 24px", borderRadius: 4, textDecoration: "none", whiteSpace: "nowrap" }}>Create Free Account</Link>
              <Link to="/auth" style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "transparent", padding: "10px 24px", borderRadius: 4, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", whiteSpace: "nowrap", textAlign: "center" }}>Explore Dashboard</Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${T.border}`, background: T.surfaceLow, padding: "48px 0 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "4fr 2fr 2fr 3fr", gap: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: T.primary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 13 }}>trending_up</span>
              </div>
              <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 800, letterSpacing: "-0.03em", color: T.primary }}>TradeSage AI</span>
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 13, color: T.inkMuted, maxWidth: 280, lineHeight: 1.65, margin: "0 0 16px" }}>
              Democratising institutional-grade market intelligence for the Indian retail investor.
            </p>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.inkFaint, padding: "10px 12px", border: `1px solid ${T.border}`, borderRadius: 4, background: T.surface, lineHeight: 1.6 }}>
              Not a SEBI registered investment advisor. Paper trading only. Markets involve risk.{" "}
              <a href="#" style={{ color: T.primary, fontWeight: 600, textDecoration: "underline" }}>Disclosures →</a>
            </div>
          </div>

          <FooterCol title="Product" links={[["Features","#features"],["AI Copilot","#copilot"],["Market Data","/auth"],["Terminal","/auth"]]} smooth={smooth} />
          <FooterCol title="Company" links={[["About","#"],["Pricing","#"],["Careers","#"],["Privacy","#"]]} smooth={smooth} />
          <FooterCol title="Resources" links={[["Documentation","#"],["Blog","#"],["API","#"],["Status","#"]]} smooth={smooth} />
        </div>

        <div style={{ maxWidth: 1280, margin: "32px auto 0", padding: "20px 2rem 0", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.inkFaint }}>© 2025 TradeSage AI. For educational purposes only.</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkFaint }}>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Shared style objects ──────────────────────────────────── */
const H2 = {
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontSize: "clamp(24px, 3vw, 32px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  color: "#000000",
  margin: "0 0 12px",
};
const Body = {
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontSize: 15,
  color: "#45464d",
  lineHeight: 1.65,
  margin: 0,
};

/* ─── Sub-components ────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#76777d", marginBottom: 10 }}>{children}</div>
  );
}

function Btn({ to, children }) {
  const [h, setH] = useState(false);
  return (
    <Link to={to} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "#ffffff", background: h ? "#1a1a1a" : "#000000", padding: "9px 20px", borderRadius: 4, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 0.15s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</Link>
  );
}

function BtnOutline({ href, onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onClick={onClick} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 500, color: "#000000", background: h ? "#f2f4f6" : "#ffffff", padding: "9px 20px", borderRadius: 4, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #c6c6cd", transition: "background 0.15s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>
  );
}

function FeatureCell({ icon, title, desc, last }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ padding: "28px 24px", background: h ? "#f2f4f6" : "#ffffff", borderBottom: last ? "none" : "1px solid #c6c6cd", transition: "background 0.15s", cursor: "default" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#76777d", display: "block", marginBottom: 14 }}>{icon}</span>
      <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: "#000", margin: "0 0 6px" }}>{title}</h3>
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, color: "#45464d", margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function FooterCol({ title, links, smooth }) {
  return (
    <div>
      <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#76777d", marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("#")
              ? <a href={href} onClick={(e) => smooth(e, href)} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, color: "#45464d", textDecoration: "none" }}
                  onMouseEnter={e => e.target.style.color="#000"} onMouseLeave={e => e.target.style.color="#45464d"}>{label}</a>
              : <Link to={href} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, color: "#45464d", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color="#000"} onMouseLeave={e => e.currentTarget.style.color="#45464d"}>{label}</Link>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}