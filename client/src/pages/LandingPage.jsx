import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const scrollyContainerRef = useRef(null);

  useEffect(() => {
    // 1. Scrollytelling cards implementation
    const scrollyCards = document.querySelectorAll('.scrollytelling-card');
    
    const scrollyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                scrollyCards.forEach(card => card.classList.remove('active'));
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: "-10% 0px -40% 0px"
    });

    scrollyCards.forEach(card => scrollyObserver.observe(card));

    // 2. Scroll reveal for other elements
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.glass-card, .scroll-reveal-item');
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        revealObserver.observe(el);
    });

    // 3. Handle Parallax/3D Effect on Mouse Move for Hero
    const heroMockup = document.querySelector('.mockup-inner');
    const handleMouseMove = (e) => {
        if (window.innerWidth < 1024) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        if (heroMockup) {
            heroMockup.style.transform = `rotateY(${-15 + x}deg) rotateX(${10 - y}deg)`;
        }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      scrollyCards.forEach(card => scrollyObserver.unobserve(card));
      revealElements.forEach(el => revealObserver.unobserve(el));
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden min-h-screen bg-[#F8FAFC]">
      {/* Persistent Live Pulse Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <span className="mx-4 font-data-mono uppercase text-[12px]">
            <span className="text-secondary-fixed">NIFTY 50</span> 22,453.20 <span className="text-error">(-0.45%)</span>
          </span>
          <span className="mx-4 font-data-mono uppercase text-[12px]">
            <span className="text-secondary-fixed">RELIANCE</span> 2,945.00 <span className="text-[#bec6e0]">(+1.23%)</span>
          </span>
          <span className="mx-4 font-data-mono uppercase text-[12px]">
            <span className="text-secondary-fixed">HDFCBANK</span> 1,420.15 <span className="text-error">(-0.88%)</span>
          </span>
          <span className="mx-4 font-data-mono uppercase text-[12px]">
            <span className="text-secondary-fixed">INFY</span> 1,602.40 <span className="text-[#bec6e0]">(+0.55%)</span>
          </span>
          <span className="mx-4 font-data-mono uppercase text-[12px]">
            <span className="text-secondary-fixed">TATASTEEL</span> 154.30 <span className="text-error">(-1.12%)</span>
          </span>
          <span className="mx-4 font-data-mono uppercase text-[12px]">
            <span className="text-secondary-fixed">SBI</span> 782.10 <span className="text-[#bec6e0]">(+2.10%)</span>
          </span>
        </div>
      </div>

      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant">
        <nav className="flex justify-between items-center px-margin py-md max-w-[1440px] mx-auto">
          <Link to="/" className="font-display-lg text-[24px] font-black tracking-tighter text-primary cursor-pointer">
            TRADESAGE AI
          </Link>
          <div className="hidden md:flex gap-lg items-center">
            <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md" href="#">Features</a>
            <a className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-200" href="#">Terminal</a>
            <a className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-200" href="#">Intelligence</a>
            <a className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-200" href="#">Pricing</a>
          </div>
          <div className="flex gap-md items-center">
            <Link to="/auth" className="hidden md:block font-body-md px-md py-sm text-primary hover:bg-surface-container-low transition-colors duration-200">
              Login
            </Link>
            <Link to="/auth" className="bg-primary text-on-primary font-body-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-[1440px] mx-auto px-margin pb-32">
        {/* Asymmetrical Hero Section */}
        <section className="py-xl md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-xl items-center overflow-visible">
          <div className="lg:col-span-5 z-10">
            <div className="inline-flex items-center gap-sm px-md py-xs rounded-full bg-primary text-on-primary mb-md">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span className="font-label-caps text-[10px]">NEW: AI CO-PILOT 2.0</span>
            </div>
            <h1 className="font-display-lg text-[48px] md:text-[84px] heading-tight mb-lg text-primary">
              TradeSage AI
            </h1>
            <p className="font-body-md text-body-md md:text-[22px] md:leading-[32px] text-on-surface-variant max-w-[500px] mb-xl">
              AI Powered Paper Trading Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              <Link to="/auth" className="bg-primary text-on-primary px-xl py-md font-bold text-lg rounded-lg shadow-xl shadow-primary/20 text-center">
                Start Trading
              </Link>
              <Link to="/auth" className="flex items-center justify-center gap-sm px-xl py-md font-bold text-lg text-primary hover:bg-white transition-colors">
                <span className="material-symbols-outlined">play_circle</span>Live Demo
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative three-d-mockup py-12">
            <div className="mockup-inner w-full relative rounded-2xl border border-outline-variant bg-white p-2 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-sm bg-surface-container-low p-3 border-b border-outline-variant">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/20 border border-error"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-fixed-dim"></div>
                </div>
                <div className="ml-4 font-data-mono text-[11px] text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  tradesage.ai/terminal/main_view
                </div>
              </div>
              <div className="aspect-video bg-white overflow-hidden relative">
                <img
                  alt="Terminal UI Preview"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZH5K1H_C2V7LUHUD6gMTxhzo2CPwiHjOqK-aLSk-abiTw_igjw4Tc6B7CEANK6Kf5BvXFUHQd7ZzXBe0q2a0BE7EbceozGUE_lJ65ba3lFAHM0qkPV84JxW-Bh8XvAEw4_own6SofTecfFFq7XLoqZckC_cZ8K5UL7qMqbpv_bXIjdIiBmA3W1fQsCW1N9WWZQXvvGlJyXFJ91frW_in_naUUdCY-Mt1QepfU-qrHPSGAWkw9VufI0dKNKxMAj5_4WAH-EDegW7k"
                />
                <div className="absolute bottom-6 right-6 glass-card p-6 w-72 rounded-xl border border-white/50 shadow-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                    <span className="font-label-caps text-[11px] text-primary">CO-PILOT INSIGHT</span>
                  </div>
                  <p className="text-sm font-body-md leading-relaxed text-primary">
                    "NIFTY is forming a bull flag on the 15m chart. Institutional bid-ask spread is tightening at 22,440. High probability bounce zone detected."
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container rounded-full blur-[80px] -z-10 opacity-50"></div>
            <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-primary-fixed rounded-full blur-[100px] -z-10 opacity-30"></div>
          </div>
        </section>

        {/* Scrollytelling Section */}
        <section className="py-24 relative" ref={scrollyContainerRef}>
          <div className="sticky top-1/4 h-[30vh] pointer-events-none z-0">
            <div className="absolute left-0 w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="font-display-lg text-[48px] md:text-[64px] heading-tight mb-8 text-slate-300 select-none">
                Intelligence<br />on Autopilot
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-xl relative z-10">
            <div className="hidden md:block md:col-span-6"></div>
            <div className="md:col-span-6 space-y-[40vh] py-24">
              {/* Step 1 */}
              <div className="scrollytelling-card glass-card p-xl rounded-2xl flex flex-col gap-lg border-2 border-primary/5 active">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">insights</span>
                </div>
                <div>
                  <h3 className="font-display-lg text-display-lg mb-md text-[#0f172a]">Deep Market Pulse</h3>
                  <p className="text-on-surface-variant text-lg">Our AI analyzes thousands of data points from order books, global sentiment, and historical patterns to give you the "why" behind the move.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="scrollytelling-card glass-card p-xl rounded-2xl flex flex-col gap-lg border-2 border-primary/5">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <div>
                  <h3 className="font-display-lg text-display-lg mb-md text-[#0f172a]">Risk Guardrails</h3>
                  <p className="text-on-surface-variant text-lg">Before you execute, we calculate real-time volatility-adjusted exposure. Stop over-leveraging and start trading like a fund manager.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="scrollytelling-card glass-card p-xl rounded-2xl flex flex-col gap-lg border-2 border-primary/5">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">terminal</span>
                </div>
                <div>
                  <h3 className="font-display-lg text-display-lg mb-md text-[#0f172a]">Zero-Lag Execution</h3>
                  <p className="text-on-surface-variant text-lg">Connected via fiber directly to NSE and MCX. Experience sub-15ms execution latency that keeps you ahead of the retail crowd.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating "Glass" Feature Cards */}
        <section className="py-24 scroll-reveal-item">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <span className="font-label-caps text-primary tracking-[0.2em] mb-4 block">CORE CAPABILITIES</span>
            <h2 className="font-display-lg text-[48px] heading-tight text-primary">Everything you need,<br />nothing you don't.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
            <div className="md:col-span-4 glass-card p-xl rounded-2xl hover:-translate-y-4 transition-transform duration-500 group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <h4 className="font-display-lg text-headline-md mb-md text-[#0f172a]">Live Market Data</h4>
              <p className="text-on-surface-variant">Real-time institutional feeds with sub-millisecond latency.</p>
            </div>
            <div className="md:col-span-4 glass-card p-xl rounded-2xl hover:-translate-y-4 transition-transform duration-500 group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">currency_exchange</span>
              </div>
              <h4 className="font-display-lg text-headline-md mb-md text-[#0f172a]">Paper Trading</h4>
              <p className="text-on-surface-variant">Risk-free environment to test strategies with virtual capital.</p>
            </div>
            <div className="md:col-span-4 glass-card p-xl rounded-2xl hover:-translate-y-4 transition-transform duration-500 group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <h4 className="font-display-lg text-headline-md mb-md text-[#0f172a]">AI Recommendations</h4>
              <p className="text-on-surface-variant">Predictive insights powered by our proprietary AI engine.</p>
            </div>
            <div className="md:col-span-6 glass-card p-xl rounded-2xl hover:-translate-y-4 transition-transform duration-500 group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h4 className="font-display-lg text-headline-md mb-md text-[#0f172a]">Portfolio Analytics</h4>
              <p className="text-on-surface-variant">Deep dive into your performance metrics and risk exposure.</p>
            </div>
            <div className="md:col-span-6 glass-card p-xl rounded-2xl hover:-translate-y-4 transition-transform duration-500 group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">list_alt</span>
              </div>
              <h4 className="font-display-lg text-headline-md mb-md text-[#0f172a]">Real-time Watchlists</h4>
              <p className="text-on-surface-variant">Dynamic tracking of your favorite assets with instant alerts.</p>
            </div>
          </div>
        </section>

        {/* Bold CTA Section */}
        <section className="py-24 border-t border-outline-variant/30 scroll-reveal-item">
          <div className="text-center mb-12">
            <span className="font-label-caps text-primary tracking-[0.2em] mb-4 block">ENGINEERING EXCELLENCE</span>
            <h2 className="font-display-lg text-[40px] heading-tight text-primary">Built with Precision</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-xl items-center opacity-60">
            <div className="flex flex-col items-center gap-2">
              <span className="font-data-mono text-xl font-bold text-[#0f172a]">MongoDB</span>
              <span className="text-[10px] font-label-caps text-slate-400">DATABASE</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-data-mono text-xl font-bold text-[#0f172a]">Express</span>
              <span className="text-[10px] font-label-caps text-slate-400">BACKEND</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-data-mono text-xl font-bold text-[#0f172a]">React</span>
              <span className="text-[10px] font-label-caps text-slate-400">FRONTEND</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-data-mono text-xl font-bold text-[#0f172a]">Node.js</span>
              <span className="text-[10px] font-label-caps text-slate-400">RUNTIME</span>
            </div>
            <div className="h-12 w-px bg-outline-variant mx-4"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-data-mono text-xl font-bold text-[#0f172a]">AI Engine</span>
              <span className="text-[10px] font-label-caps text-slate-400">PROPRIETARY</span>
            </div>
          </div>
        </section>

        <section className="py-24 scroll-reveal-item">
          <div className="bg-primary text-on-primary p-xl md:p-32 rounded-[2rem] text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
            <div className="relative z-10">
              <h2 className="font-display-lg text-[40px] md:text-[72px] heading-tight mb-xl max-w-4xl mx-auto">
                Stop guessing. <span className="text-secondary-fixed">Start trading</span> with conviction.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-lg">
                <Link to="/auth" className="w-full sm:w-auto bg-white text-primary px-12 py-5 font-black text-xl rounded-xl hover:scale-105 transition-transform text-center">
                  Get Started Now
                </Link>
                <Link to="/auth" className="w-full sm:w-auto border-2 border-white/20 text-white px-12 py-5 font-black text-xl rounded-xl hover:bg-white/10 transition-colors text-center">
                  Request API Access
                </Link>
              </div>
              <p className="mt-xl opacity-60 font-body-sm">Join 15,000+ serious traders. No credit card required to start.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant pt-24 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl px-margin max-w-[1440px] mx-auto">
          <div className="md:col-span-5">
            <div className="font-display-lg text-[28px] font-black tracking-tighter text-primary mb-md">TRADESAGE AI</div>
            <p className="font-body-md text-on-surface-variant max-w-sm mb-lg">
              Democratizing institutional-grade market intelligence for the Indian retail investor. Built with precision, powered by AI.
            </p>
            <div className="flex gap-md">
              <div className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">public</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">share</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-label-caps text-primary mb-md">PLATFORM</h4>
            <ul className="space-y-sm">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Features</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Market Data</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">API Ecosystem</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Institutional</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-label-caps text-primary mb-md">COMPANY</h4>
            <ul className="space-y-sm">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">About Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Our Data</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Security</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Compliance</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-label-caps text-primary mb-md">COMPLIANCE</h4>
            <div className="bg-white p-md rounded-xl border border-outline-variant space-y-sm">
              <p className="text-[11px] leading-relaxed text-on-surface-variant">
                TradeSage is a technology provider and not a SEBI registered investment advisor. Markets are subject to risk.
              </p>
              <a className="block text-primary underline text-xs font-bold" href="#">NSE Disclosures</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}