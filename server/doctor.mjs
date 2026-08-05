/**
 * TradeSage AI — Doctor Script
 * ============================
 * Run: node doctor.mjs   (or: npm run doctor)
 *
 * Performs a complete pre-flight health check of every subsystem.
 * Exit code 0 = all checks passed.
 * Exit code 1 = one or more checks failed.
 */

import dotenv from 'dotenv';
dotenv.config();

// ─── ANSI Color Helpers ────────────────────────────────────────────────────
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';
const RESET  = '\x1b[0m';

const OK   = `${GREEN}${BOLD}  ✔  PASS${RESET}`;
const FAIL = `${RED}${BOLD}  ✖  FAIL${RESET}`;
const WARN = `${YELLOW}${BOLD}  ⚠  WARN${RESET}`;
const SKIP = `${YELLOW}${BOLD}  ─  SKIP${RESET}`;

const results = [];

function pad(str, len = 38) {
  return str.padEnd(len, '.');
}

function check(label, status, detail = '') {
  const icon = status === 'pass' ? OK : status === 'warn' ? WARN : status === 'skip' ? SKIP : FAIL;
  const detailStr = detail ? `  ${DIM}${detail}${RESET}` : '';
  console.log(`   ${pad(label)}${icon}${detailStr}`);
  results.push({ label, status });
}

async function run(label, fn) {
  try {
    const detail = await fn();
    check(label, 'pass', detail);
  } catch (err) {
    check(label, 'fail', err.message?.slice(0, 80));
  }
}

// ─── Banner ────────────────────────────────────────────────────────────────
console.log();
console.log(`${BOLD}${CYAN}╔══════════════════════════════════════════════════╗`);
console.log(`║       TradeSage AI  —  System Doctor  🩺         ║`);
console.log(`╚══════════════════════════════════════════════════╝${RESET}`);
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 1. ENVIRONMENT VARIABLES
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  Environment Variables${RESET}`);

const requiredEnv = [
  'MONGO_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET',
  'FINNHUB_API_KEY', 'NVIDIA_API_KEY', 'NVIDIA_BASE_URL',
];
const optionalEnv = ['REDIS_URL', 'SMARTAPI_API_KEY', 'NEWS_CACHE_MINUTES'];

for (const key of requiredEnv) {
  if (process.env[key]) {
    check(key, 'pass', '✓ set');
  } else {
    check(key, 'fail', 'MISSING — server will not start!');
  }
}
for (const key of optionalEnv) {
  if (process.env[key]) {
    check(key, 'pass', '✓ set');
  } else {
    check(key, 'warn', 'Not set — optional feature may be disabled');
  }
}
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 2. MONGODB
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  MongoDB${RESET}`);

import mongoose from 'mongoose';

await run('MongoDB Connection', async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  const state = mongoose.connection.readyState === 1 ? 'connected' : 'not connected';
  return state;
});

await run('Collections Present', async () => {
  if (mongoose.connection.readyState !== 1) throw new Error('Not connected');
  const db = mongoose.connection.db;
  const cols = (await db.listCollections().toArray()).map(c => c.name);
  const expected = ['users', 'orders', 'portfolios'];
  const missing = expected.filter(c => !cols.includes(c));
  if (missing.length > 0) throw new Error(`Missing: ${missing.join(', ')}`);
  return `${cols.length} collections found`;
});
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 3. REDIS
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  Redis${RESET}`);

import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms))
  ]);

await run('Redis Connection', async () => {
  const client = createClient({ url: redisUrl, socket: { connectTimeout: 4000, reconnectStrategy: false } });
  client.on('error', () => {});
  await withTimeout(client.connect(), 5000, 'Redis connect');
  const pong = await client.ping();
  await client.quit();
  if (pong !== 'PONG') throw new Error(`Unexpected response: ${pong}`);
  return `PONG received — ${redisUrl}`;
});

await run('Redis Read/Write', async () => {
  const client = createClient({ url: redisUrl, socket: { connectTimeout: 4000, reconnectStrategy: false } });
  client.on('error', () => {});
  await withTimeout(client.connect(), 5000, 'Redis connect');
  await client.set('doctor:test', 'ok', { EX: 10 });
  const val = await client.get('doctor:test');
  await client.del('doctor:test');
  await client.quit();
  if (val !== 'ok') throw new Error('Read/Write failed');
  return 'SET → GET → DEL OK';
});
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 4. NVIDIA NIM (LLM)
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  NVIDIA NIM (LLM)${RESET}`);

await run('NIM API Reachable', async () => {
  if (!process.env.NVIDIA_API_KEY) throw new Error('NVIDIA_API_KEY not set');
  const { generateNIMCompletion } = await import('./services/ai/nimService.js');
  const result = await generateNIMCompletion(
    [{ role: 'user', content: 'Reply with the single word: ok' }],
    { maxTokens: 8 }
  );
  if (!result) throw new Error('Empty response from NIM');
  return `Response: "${String(result).trim().slice(0, 40)}"`;
});
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 5. NEWS SERVICE
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  News Service${RESET}`);

await run('News Provider (RSS)', async () => {
  const { getCompanyNews } = await import('./services/news/newsProvider.js');
  const articles = await getCompanyNews('INFY');
  if (!articles || articles.length === 0) throw new Error('No articles returned');
  return `${articles.length} articles — "${articles[0]?.headline?.slice(0, 50)}..."`;
});

await run('Sentiment Analyzer', async () => {
  const { analyzeArticles } = await import('./services/news/sentimentService.js');
  const fakeArticles = [
    { title: 'Stock market rises strongly today', text: 'Investors are bullish' },
    { title: 'Market crashes on poor earnings', text: 'Losses across the board' },
  ];
  const enriched = analyzeArticles(fakeArticles);
  if (!enriched || enriched.length === 0) throw new Error('Sentiment failed');
  return `${enriched.length} articles analyzed`;
});
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 6. FINNHUB WebSocket KEY
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  Finnhub${RESET}`);

await run('Finnhub API Key Set', async () => {
  if (!process.env.FINNHUB_API_KEY) throw new Error('FINNHUB_API_KEY not set');
  return `Key: ...${process.env.FINNHUB_API_KEY.slice(-8)}`;
});

// Test Finnhub REST quote endpoint
await run('Finnhub REST Quote (AAPL)', async () => {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error('No API key');
  const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${key}`);
  const data = await res.json();
  if (!data || !data.c) throw new Error('Invalid response from Finnhub');
  return `AAPL current price: $${data.c}`;
});
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 7. SMARTAPI
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  SmartAPI (Angel One)${RESET}`);

if (!process.env.SMARTAPI_API_KEY) {
  check('SmartAPI Connection', 'skip', 'SMARTAPI_API_KEY not set');
} else {
  await run('SmartAPI Credentials Set', async () => {
    const required = ['SMARTAPI_API_KEY', 'SMARTAPI_CLIENT_CODE', 'SMARTAPI_PASSWORD', 'SMARTAPI_TOTP_SECRET'];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
    return 'All SmartAPI credentials present';
  });
}
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 8. HTTP HEALTH ENDPOINT
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  HTTP Health Endpoint${RESET}`);

const PORT = process.env.PORT || 5000;

await run('GET /api/health', async () => {
  try {
    const res = await fetch(`http://localhost:${PORT}/api/health`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return `status: ${body.status}, db: ${body.database}, redis: ${body.redis}`;
  } catch (e) {
    if (e.code === 'ECONNREFUSED' || e.name === 'TimeoutError' || e.cause?.code === 'ECONNREFUSED') {
      throw new Error(`Server not running on port ${PORT} — start it first`);
    }
    throw e;
  }
});
console.log();

// ══════════════════════════════════════════════════════════════════════════
// 9. PRODUCTION BUILD CHECK
// ══════════════════════════════════════════════════════════════════════════
console.log(`${BOLD}${CYAN}▶  Frontend Build${RESET}`);

import { existsSync } from 'fs';
import { resolve } from 'path';

const distPath = resolve(process.cwd(), '../client/dist/index.html');
if (existsSync(distPath)) {
  check('Production Build (dist/)', 'pass', 'client/dist/index.html found');
} else {
  check('Production Build (dist/)', 'warn', 'Run: cd client && npm run build');
}
console.log();

// ══════════════════════════════════════════════════════════════════════════
// RESULTS SUMMARY
// ══════════════════════════════════════════════════════════════════════════
const passed = results.filter(r => r.status === 'pass').length;
const failed = results.filter(r => r.status === 'fail').length;
const warned = results.filter(r => r.status === 'warn').length;
const skipped = results.filter(r => r.status === 'skip').length;

console.log(`${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  SUMMARY${RESET}`);
console.log(`  ${GREEN}${BOLD}✔  ${passed} Passed${RESET}`);
if (warned > 0)  console.log(`  ${YELLOW}${BOLD}⚠  ${warned} Warnings${RESET}`);
if (skipped > 0) console.log(`  ${YELLOW}${BOLD}─  ${skipped} Skipped${RESET}`);
if (failed > 0)  console.log(`  ${RED}${BOLD}✖  ${failed} Failed${RESET}`);
console.log(`${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}`);
console.log();

if (failed > 0) {
  console.log(`${RED}${BOLD}  ✖  Some checks failed. Fix the above issues before deploying.${RESET}`);
  console.log();
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}  ✔  All systems operational. Ready for Day 13 deployment! 🚀${RESET}`);
  console.log();
  await mongoose.disconnect().catch(() => {});
  process.exit(0);
}
