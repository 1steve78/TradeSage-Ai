import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/authRoutes.js"; 
import marketRoutes from "./routes/marketRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import tradingRoutes from "./routes/tradingRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import scannerRoutes from "./routes/scannerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'TradeSage-AI server is healthy',
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", marketRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/watchlists", watchlistRoutes);
app.use("/api/trading",tradingRoutes);
app.use("/api/portfolio",portfolioRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/scanner", scannerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/orders", orderRoutes);

export default app;