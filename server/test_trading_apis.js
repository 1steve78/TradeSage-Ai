import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import http from 'http';
import mongoose from 'mongoose';
import axios from 'axios';
import app from './app.js';
import connectMongo from './config/database.js';

const PORT = 5005; // Use a different port to avoid conflicts
let server;

// Helper to make API requests
const api = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
  validateStatus: () => true, // Don't throw on non-200 responses
});

const runTests = async () => {
  console.log("=== STARTING TRADING API VERIFICATION TESTS ===");

  try {
    // 1. Connect to Mongo and Start Server
    await connectMongo();
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`Test server running on port ${PORT}`);

    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const password = "password123";

    // 2. Test User Registration
    console.log(`\n1. Registering user: ${uniqueEmail}`);
    const regRes = await api.post('/auth/register', {
      name: "API Test User",
      email: uniqueEmail,
      password: password
    });

    console.log("Registration Response:", JSON.stringify(regRes.data, null, 2));
    if (regRes.status !== 201) {
      throw new Error(`Registration failed with status ${regRes.status}`);
    }

    // 3. Test User Login
    console.log("\n2. Logging in...");
    const loginRes = await api.post('/auth/login', {
      email: uniqueEmail,
      password: password
    });

    console.log("Login Response Status:", loginRes.status);
    if (loginRes.status !== 200 || !loginRes.data.accessToken) {
      throw new Error("Login failed or no token received");
    }

    const token = loginRes.data.accessToken;
    console.log("Access Token acquired!");

    // Configure Authorization Header for subsequent requests
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 4. Test GET /api/portfolio (Initial State)
    console.log("\n3. Fetching Initial Portfolio...");
    const portRes1 = await api.get('/portfolio', config);
    console.log("Initial Portfolio Status:", portRes1.status);
    console.log("Initial Portfolio Data:", JSON.stringify(portRes1.data, null, 2));
    if (portRes1.status !== 200 || !portRes1.data.success) {
      throw new Error("Failed to fetch initial portfolio");
    }
    const initialCash = portRes1.data.data.cash;
    console.log(`Starting Cash: $${initialCash}`);

    // 5. Test POST /api/trading/buy
    console.log("\n4. Placing Buy Order: 10 shares of AAPL...");
    const buyRes = await api.post('/trading/buy', {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      quantity: 10
    }, config);

    console.log("Buy Order Response:", JSON.stringify(buyRes.data, null, 2));
    if (buyRes.status !== 200 || !buyRes.data.success) {
      throw new Error(`Buy order failed: ${buyRes.data.message || 'unknown error'}`);
    }

    // 6. Test GET /api/portfolio (Post-Buy State)
    console.log("\n5. Fetching Portfolio after Buy...");
    const portRes2 = await api.get('/portfolio', config);
    console.log("Post-Buy Portfolio Data:", JSON.stringify(portRes2.data, null, 2));
    const postBuyCash = portRes2.data.data.cash;
    const aaplHolding = portRes2.data.data.holdings.find(h => h.symbol === 'AAPL');

    if (!aaplHolding || aaplHolding.quantity !== 10) {
      throw new Error("Portfolio holdings do not reflect correct AAPL quantity of 10");
    }
    console.log(`Post-Buy Cash: $${postBuyCash} (Deducted: $${Number((initialCash - postBuyCash).toFixed(2))})`);

    // 7. Test POST /api/trading/sell
    console.log("\n6. Placing Sell Order: 5 shares of AAPL...");
    const sellRes = await api.post('/trading/sell', {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      quantity: 5
    }, config);

    console.log("Sell Order Response:", JSON.stringify(sellRes.data, null, 2));
    if (sellRes.status !== 200 || !sellRes.data.success) {
      throw new Error(`Sell order failed: ${sellRes.data.message || 'unknown error'}`);
    }

    // 8. Test GET /api/portfolio (Post-Sell State)
    console.log("\n7. Fetching Portfolio after Sell...");
    const portRes3 = await api.get('/portfolio', config);
    console.log("Post-Sell Portfolio Data:", JSON.stringify(portRes3.data, null, 2));
    const postSellCash = portRes3.data.data.cash;
    const aaplHoldingAfterSell = portRes3.data.data.holdings.find(h => h.symbol === 'AAPL');

    if (!aaplHoldingAfterSell || aaplHoldingAfterSell.quantity !== 5) {
      throw new Error("Portfolio holdings do not reflect correct AAPL quantity of 5 after sell");
    }
    console.log(`Post-Sell Cash: $${postSellCash} (Added: $${Number((postSellCash - postBuyCash).toFixed(2))})`);

    // 9. Test GET /api/portfolio/transactions
    console.log("\n8. Fetching Transactions List...");
    const txRes = await api.get('/portfolio/transactions', config);
    console.log("Transactions Response Status:", txRes.status);
    console.log("Transactions List:", JSON.stringify(txRes.data, null, 2));

    if (txRes.status !== 200 || !txRes.data.success || !Array.isArray(txRes.data.data)) {
      throw new Error("Failed to fetch transactions");
    }

    if (txRes.data.data.length < 2) {
      throw new Error(`Expected at least 2 transactions, got ${txRes.data.data.length}`);
    }

    const buyTx = txRes.data.data.find(tx => tx.type === 'BUY');
    const sellTx = txRes.data.data.find(tx => tx.type === 'SELL');

    if (!buyTx || !sellTx) {
      throw new Error("Could not find both BUY and SELL transactions in history");
    }

    console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    // 10. Clean up connections
    console.log("\nCleaning up connections...");
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("HTTP server closed.");
    }
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit();
  }
};

runTests();
