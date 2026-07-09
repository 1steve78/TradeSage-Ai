import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes.js"; // Notice the .js extension!

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

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'TradeSage-AI server is healthy',
  });
});

app.use("/api/auth", authRoutes);

export default app; // Replaced module.exports