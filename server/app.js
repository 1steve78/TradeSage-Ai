import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/authRoutes.js"; 
import marketRoutes from "./routes/marketRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

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
app.use("/api/watchlists", watchlistRoutes);

export default app;