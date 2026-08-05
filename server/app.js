import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import mongoose from 'mongoose';
import logger from './infrastructure/logger.js';
import redisClient from './infrastructure/redis.js';
import { serverAdapter } from './infrastructure/bullmq.js';
import { 
    globalLimiter, 
    authLimiter, 
    aiLimiter, 
    ordersLimiter, 
    marketLimiter, 
    dashboardLimiter 
} from './config/security.config.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';
import { protect, adminProtect } from './middleware/authMiddleware.js';
import { performanceMonitor } from './middleware/performanceMonitor.js';

import authRoutes from './routes/authRoutes.js'; 
import marketRoutes from './routes/marketRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import tradingRoutes from './routes/tradingRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import scannerRoutes from './routes/scannerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import preferencesRoutes from './routes/preferencesRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ── Health Check (exempt from rate limiting so monitors can always reach it) ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redisClient.isOpen ? 'connected' : 'disconnected',
  });
});

// ── Global Rate Limiter ───────────────────────────────────────────────────────
app.use(globalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// ── Data Sanitization ─────────────────────────────────────────────────────────
app.use(mongoSanitize());
app.use(hpp());

// ── Request Logging ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// ── Performance Monitor ───────────────────────────────────────────────────────
app.use(performanceMonitor);

// ── BullMQ Admin UI ───────────────────────────────────────────────────────────
app.use('/admin/queues', protect, adminProtect, serverAdapter.getRouter());

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/stocks', marketLimiter, marketRoutes);
app.use('/api/market', marketLimiter, marketRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/news', newsRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/dashboard', dashboardLimiter, dashboardRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/orders', ordersLimiter, orderRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler (Express 5: app.use catch-all instead of app.all("*")) ────────
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'NOT_FOUND'));
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;