import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const NewsCache = mongoose.model('NewsCache', new mongoose.Schema({
  cacheKey:  String,
  provider:  String,
  articles:  Array,
  expiresAt: Date,
}));

const all = await NewsCache.find({}, { cacheKey: 1, provider: 1, articles: 1 }).lean();
console.log('=== Current cache entries ===');
all.forEach(e => {
  const count = e.articles?.length ?? 0;
  console.log(
    (e.cacheKey || '').padEnd(32),
    '| provider:', (e.provider || 'finnhub').padEnd(12),
    '| articles:', count
  );
});

// Delete: old Finnhub entries OR empty article arrays
const result = await NewsCache.deleteMany({
  $or: [
    { provider: 'finnhub' },
    { provider: { $exists: false } },
    { 'articles.0': { $exists: false } },  // empty array
  ]
});

console.log('\nDeleted stale/empty cache entries:', result.deletedCount);

const remaining = await NewsCache.countDocuments();
console.log('Remaining entries:', remaining);

await mongoose.disconnect();
console.log('Done.');
