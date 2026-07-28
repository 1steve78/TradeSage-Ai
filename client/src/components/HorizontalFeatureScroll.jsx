import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    icon: "monitoring",
    title: "Connect to Live Markets",
    desc: "Plug into real-time NSE & BSE feeds — the same institutional data powering professional terminals, with zero latency lag.",
    metric: "< 50ms",
    metricLabel: "Data Latency",
    highlight: "#10b981",
  },
  {
    number: "02",
    icon: "psychology",
    title: "Let AI Analyze Everything",
    desc: "Our proprietary engine reads order books, news sentiment, technical indicators, and macro signals — all at once, continuously.",
    metric: "10,000+",
    metricLabel: "Signals / Second",
    highlight: "#3b82f6",
  },
  {
    number: "03",
    icon: "bolt",
    title: "Trade with Conviction",
    desc: "Execute paper trades, track your P&L, and get AI-driven feedback that turns every trade into a learning opportunity.",
    metric: "100%",
    metricLabel: "Risk-Free",
    highlight: "#f59e0b",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Auto-cycle active step
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setActiveStep((s) => (s + 1) % STEPS.length), 3200);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "96px 0",
        background: "#0b0f14",
        borderRadius: 24,
        marginBottom: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#3b82f6",
              display: "block",
              marginBottom: 12,
            }}
          >
            How It Works
          </span>
          <h2
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#fff",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Intelligence on Autopilot
          </h2>
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.45)",
              marginTop: 14,
              maxWidth: 520,
              margin: "14px auto 0",
              lineHeight: 1.6,
            }}
          >
            From raw market data to confident trading decisions — in three seamless steps.
          </p>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            position: "relative",
          }}
        >
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 52,
              left: "calc(33.33% + 0px)",
              right: "calc(33.33% + 0px)",
              height: 1,
              background: "rgba(255,255,255,0.07)",
              zIndex: 0,
            }}
          />

          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            const delay = `${i * 0.12}s`;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(i)}
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isActive ? step.highlight + "55" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 16,
                  padding: "32px 28px",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 1,
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(32px)",
                  transitionDelay: delay,
                  boxShadow: isActive
                    ? `0 0 0 1px ${step.highlight}33, 0 20px 60px rgba(0,0,0,0.4)`
                    : "none",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: isActive ? step.highlight : "rgba(255,255,255,0.2)",
                    marginBottom: 20,
                    transition: "color 0.4s",
                  }}
                >
                  STEP {step.number}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: isActive ? step.highlight + "22" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isActive ? step.highlight + "44" : "rgba(255,255,255,0.08)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    transition: "all 0.4s",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 24,
                      color: isActive ? step.highlight : "rgba(255,255,255,0.4)",
                      transition: "color 0.4s",
                    }}
                  >
                    {step.icon}
                  </span>
                </div>

                {/* Text */}
                <h3
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    margin: "0 0 28px",
                    lineHeight: 1.65,
                  }}
                >
                  {step.desc}
                </p>

                {/* Metric pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: isActive ? step.highlight + "18" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isActive ? step.highlight + "33" : "rgba(255,255,255,0.06)"}`,
                    transition: "all 0.4s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 20,
                      fontWeight: 700,
                      color: isActive ? step.highlight : "rgba(255,255,255,0.3)",
                      transition: "color 0.4s",
                    }}
                  >
                    {step.metric}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {step.metricLabel}
                  </span>
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: step.highlight,
                      boxShadow: `0 0 12px ${step.highlight}`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 36,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.5s",
          }}
        >
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                width: activeStep === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: activeStep === i ? step.highlight : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}