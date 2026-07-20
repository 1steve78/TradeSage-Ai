import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/authRoutes.js"; 
import marketRoutes from "./routes/marketRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import tradingRoutes from "./routes/tradingRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

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

export default app;