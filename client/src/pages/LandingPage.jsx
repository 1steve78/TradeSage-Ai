// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-md text-center gap-lg">
      <div className="flex items-center gap-xs">
        <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'wght' 700" }}>
          query_stats
        </span>
      </div>
      
      <h1 className="font-display-lg text-display-lg text-on-surface">
        TradeSage AI Terminal
      </h1>
      
      <p className="font-body-md text-body-md text-on-surface-variant max-w-[500px]">
        The ultimate institutional trading terminal powered by artificial intelligence. Experience real-time analytics, predictive modeling, and secure execution.
      </p>
      
      <Link 
        to="/auth" 
        className="mt-md bg-primary text-on-primary font-title-sm text-title-sm px-xl py-sm rounded transition-all hover:bg-on-surface-variant active:scale-[0.98] flex items-center gap-sm"
      >
        Get Started
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </Link>
    </div>
  );
}