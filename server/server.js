import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';


import app from './app.js'; 
import connectMongo from './config/database.js'; 
import {initializeSocket} from './sockets/socketHandler.js'; 
import { loadInstruments } from './services/marketService.js';
import './services/notification/notificationService.js';
import { loadPendingOrders } from './services/orders/pendingOrderService.js';
import { initializeTriggerEngine } from './services/orders/triggerEngine.js';

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

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Warm up the market data cache asynchronously so searches are fast
      loadInstruments().catch(err => {
        console.error("Failed to pre-warm market instruments cache:", err.message);
      });

      // Initialize Milestone 4 Trigger Engine
      loadPendingOrders();
      initializeTriggerEngine();
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();