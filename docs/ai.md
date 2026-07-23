# 🧠 TradeSage AI - System Architecture & Subsystem Specification

## Overview

TradeSage AI incorporates a production-ready, decoupled AI subsystem powered by **NVIDIA NIM** (OpenAI-compatible inference) and orchestrated via **LangGraph**. The system is built around a ground-truth Context Service that compiles user portfolio holdings, analytics metrics, real-time market movers, and news headlines into structured context before feeding prompts into the LLM.

---

## 🏗 Architecture & Flow

```text
                                  React Dashboard
                                         │
                                         ▼
                            POST /api/ai/market-pulse
                                         │
                                         ▼
                                  aiController.js
                                         │
                                         ▼
                                  marketGraph.js
                                         │
      ┌──────────────────────────────────┼──────────────────────────────────┐
      ▼                                  ▼                                  ▼
Context Service                   Prompt Service                     Cache Service
      │                                                                     │
      ▼                                                                     ▼
Portfolio & Watchlist                                                Cache Hit?
Market Movers                                                        /        \
News Headlines                                                     Yes        No
      │                                                             │          │
      └──────────────────────────► NVIDIA NIM ◄─────────────────────┘          ▼
                                         │                               MongoDB Cache
                                         ▼
                                 AI Market Summary
```

---

## 📊 Caching & Expiration Policy

Cache invalidation is driven by **deterministic hashing (`contextHash`)** and **MongoDB TTL Indexes (`expiresAt`)**.

| Insight Type | Cache Policy (TTL) | Rationale |
| :--- | :--- | :--- |
| `MARKET_PULSE` | 30 minutes | Balances broad intraday market trends with fresh sentiment |
| `PORTFOLIO_SUMMARY` | 5 minutes | Reflects fast portfolio balance changes after stock trades |
| `NEWS` | 15 minutes | Captures fast breaking news sentiment updates |
| `RISK` | 60 minutes | Portfolio risk scores change gradually unless major trades occur |

### TTL Index Setup
```javascript
aiInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 🔄 LangGraph Graph Workflows

Each AI feature operates on its own dedicated LangGraph StateGraph workflow in `server/graphs/`:

- `marketGraph.js`: Orchestrates Market Pulse workflow
- `portfolioGraph.js`: Orchestrates personalized portfolio analysis
- `riskGraph.js`: Evaluates portfolio concentration and downside exposure
- `newsGraph.js`: Performs news sentiment analysis
- `strategyGraph.js`: Provides trading strategy & rebalancing suggestions

---

## 🔌 API Endpoints

### 1. Market Pulse
`POST /api/ai/market-pulse`
- Body: `{ forceRefresh: false }`
- Returns:
```json
{
  "success": true,
  "data": {
    "summary": "🧠 Market Pulse Summary...",
    "generatedAt": "2026-07-23T23:20:00.000Z",
    "cached": true
  }
}
```

### 2. Insight History
`GET /api/ai/history?page=1&limit=10`
- Returns paginated history items excluding internal context hashes and raw prompts.

### 3. AI Statistics & Cache Metrics
`GET /api/ai/stats`
- Returns:
```json
{
  "success": true,
  "data": {
    "totalInsights": 48,
    "cachedResponses": 38,
    "freshResponses": 10,
    "cacheHitRate": 79
  }
}
```

---

## 💡 Developer Setup & Environment Variables

```env
NVIDIA_API_KEY=your_nvidia_nim_api_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
```
