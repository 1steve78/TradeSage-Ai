import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB connected\n');

// ── Step 1: RSS Provider ──────────────────────────────────────────────────
console.log('=== STEP 1: newsProvider.getCompanyNews("INFY") ===');
let articles = [];
try {
  const { getCompanyNews } = await import('./services/news/newsProvider.js');
  articles = await getCompanyNews('INFY');
  console.log(`  OK — ${articles.length} raw articles`);
  if (articles[0]) {
    console.log(`  Sample headline: ${articles[0].headline?.slice(0, 80)}`);
    console.log(`  Sample source  : ${articles[0].source}`);
    console.log(`  Sample url     : ${articles[0].url?.slice(0, 60)}...`);
  }
} catch (err) {
  console.error('  FAILED:', err.message);
}

// ── Step 2: Normalizer ────────────────────────────────────────────────────
console.log('\n=== STEP 2: newsNormalizer.normalizeArticles() ===');
let normalised = [];
try {
  const { normalizeArticles } = await import('./services/news/newsNormalizer.js');
  normalised = normalizeArticles(articles, 20);
  console.log(`  OK — ${normalised.length} normalised articles`);
  if (normalised[0]) {
    console.log(`  Sample title      : ${normalised[0].title?.slice(0, 80)}`);
    console.log(`  Sample publishedAt: ${normalised[0].publishedAt}`);
    console.log(`  Sample source     : ${normalised[0].source}`);
  }
} catch (err) {
  console.error('  FAILED:', err.message);
  console.error(err.stack);
}

// ── Step 3: Sentiment ─────────────────────────────────────────────────────
console.log('\n=== STEP 3: sentimentService.analyzeArticles() ===');
let enriched = [];
try {
  const { analyzeArticles } = await import('./services/news/sentimentService.js');
  enriched = analyzeArticles(normalised);
  const bullish = enriched.filter(a => a.sentiment === 'Bullish').length;
  const bearish = enriched.filter(a => a.sentiment === 'Bearish').length;
  const neutral = enriched.filter(a => a.sentiment === 'Neutral').length;
  console.log(`  OK — ${enriched.length} enriched | Bullish:${bullish} Bearish:${bearish} Neutral:${neutral}`);
} catch (err) {
  console.error('  FAILED:', err.message);
}

// ── Step 4: Full service ──────────────────────────────────────────────────
console.log('\n=== STEP 4: getStockNewsService("INFY") (with cache) ===');
try {
  const { getStockNewsService } = await import('./services/news/newsService.js');
  const result = await getStockNewsService('INFY');
  console.log(`  OK — ${result.length} final articles`);
} catch (err) {
  console.error('  FAILED:', err.message);
  console.error(err.stack);
}

// ── Step 5: NVIDIA NIM check ──────────────────────────────────────────────
console.log('\n=== STEP 5: NVIDIA NIM connectivity ===');
console.log(`  NVIDIA_API_KEY set : ${!!process.env.NVIDIA_API_KEY}`);
console.log(`  NVIDIA_BASE_URL    : ${process.env.NVIDIA_BASE_URL}`);
console.log(`  NVIDIA_MODEL       : ${process.env.NVIDIA_MODEL}`);
try {
  const { generateNIMCompletion } = await import('./services/ai/nimService.js');
  const msg = [{ role: 'user', content: 'Say "ok" in one word.' }];
  const result = await generateNIMCompletion(msg, { maxTokens: 5 });
  console.log(`  NIM response: "${result}"`);
} catch (err) {
  console.error('  NIM FAILED:', err.message);
}

await mongoose.disconnect();
console.log('\n=== Diagnosis complete ===');
