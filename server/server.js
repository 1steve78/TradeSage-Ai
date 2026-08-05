import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';

import { validateEnv } from './utils/envValidator.js';
// Validate environment before loading any app modules
validateEnv();

import app from './app.js'; 
import connectMongo from './config/database.js'; 
import {initializeSocket} from './sockets/socketHandler.js'; 
import { loadInstruments } from './services/marketService.js';
import './services/notification/notificationService.js';
import { loadPendingOrders } from './services/orders/pendingOrderService.js';
import { initializeTriggerEngine } from './services/orders/triggerEngine.js';
import { startMarketCron } from './services/marketCronService.js';

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

initializeSocket(io);
console.log('Socket server initialized');

const startServer = async () => {
  try {
    await connectMongo();

    const server = httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Warm up the market data cache asynchronously so searches are fast
      loadInstruments().catch(err => {
        console.error("Failed to pre-warm market instruments cache:", err.message);
      });

      // Initialize Milestone 4 Trigger Engine
      loadPendingOrders();
      initializeTriggerEngine();
      
      // Initialize Cron services
      startMarketCron();
    });

    // Graceful Shutdown Handlers
    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("HTTP server closed.");
        import("mongoose").then(({ default: mongoose }) => {
          mongoose.connection.close(false).then(() => {
            console.log("MongoDB connection closed.");
            process.exit(0);
          });
        });
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();