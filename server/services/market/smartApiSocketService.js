import { WebSocketV2 } from "smartapi-javascript";
import { getRawSession } from "../smartApiService.js";
import { EventEmitter } from "events";

export const marketStream = new EventEmitter();

let ws = null;
let activeTokens = new Set();
let isConnected = false;

// Map token to symbol so the frontend gets the symbol it expects
const tokenToSymbol = new Map();

export const connectWebSocket = async () => {
    if (ws && isConnected) return;
    
    try {
        const session = await getRawSession();
        if (!session) {
            throw new Error("No session available for WebSocket");
        }
        
        ws = new WebSocketV2({
            jwttoken: session.jwtToken,
            apikey: process.env.SMARTAPI_API_KEY,
            clientcode: process.env.SMARTAPI_CLIENT_CODE,
            feedtype: session.feedToken
        });
        
        ws.connect().then(() => {
            isConnected = true;
            console.log("[SmartAPI WebSocket] Connected successfully.");
            
            // Re-subscribe to all active tokens on reconnect
            if (activeTokens.size > 0) {
                resyncSubscriptions();
            }
        }).catch(err => {
            console.error("[SmartAPI WebSocket] Connection failed:", err?.message || err);
        });
        
        ws.on('tick', (data) => {
            try {
                // parse the binary tick data structure from Angel One
                data.forEach(tick => {
                    const token = tick.token;
                    // SmartAPI LTP is sometimes returned in paise for equities
                    // We divide by 100 to convert to rupees
                    const pricePaise = tick.last_traded_price;
                    if (!pricePaise) return;
                    
                    const price = Number((pricePaise / 100).toFixed(2));
                    const symbol = tokenToSymbol.get(token) || token;
                    
                    marketStream.emit('price_update', {
                        symbol: symbol,
                        price: price,
                        timestamp: Date.now()
                    });
                });
            } catch (e) {
                // Ignore parse errors silently to avoid spam
            }
        });
        
        ws.on('close', () => {
            console.log("[SmartAPI WebSocket] Closed.");
            isConnected = false;
        });
        
        ws.on('error', (err) => {
            console.error("[SmartAPI WebSocket] Error:", err?.message || err);
        });

    } catch (err) {
        console.error("[SmartAPI WebSocket] Initialization failed:", err.message);
    }
};

const resyncSubscriptions = () => {
    if (!ws || !isConnected || activeTokens.size === 0) return;
    
    const tokensArray = Array.from(activeTokens);
    ws.fetchData({
        correlationID: "resync_" + Date.now(),
        action: 1,       // 1 = Subscribe
        mode: 1,         // 1 = LTP
        exchangeType: 1, // 1 = NSE Equity
        tokens: tokensArray
    });
};

/**
 * Subscribe to live ticks for specific stocks.
 * @param {Array<{token: string, symbol: string}>} stocks 
 */
export const subscribeToStocks = (stocks) => {
    let added = false;
    const tokensToSub = [];
    
    stocks.forEach(stock => {
        if (!stock.token) return;
        tokenToSymbol.set(stock.token, stock.symbol);
        
        if (!activeTokens.has(stock.token)) {
            activeTokens.add(stock.token);
            tokensToSub.push(stock.token);
            added = true;
        }
    });
    
    if (added && ws && isConnected) {
        ws.fetchData({
            correlationID: "sub_" + Date.now(),
            action: 1, 
            mode: 1,   
            exchangeType: 1, 
            tokens: tokensToSub
        });
    }
};

/**
 * Unsubscribe from live ticks (optional, to save bandwidth if no users are watching)
 */
export const unsubscribeFromStocks = (stocks) => {
    let removed = false;
    const tokensToUnsub = [];
    
    stocks.forEach(stock => {
        if (!stock.token) return;
        
        if (activeTokens.has(stock.token)) {
            activeTokens.delete(stock.token);
            tokensToUnsub.push(stock.token);
            removed = true;
        }
    });
    
    if (removed && ws && isConnected) {
        ws.fetchData({
            correlationID: "unsub_" + Date.now(),
            action: 0, // 0 = Unsubscribe
            mode: 1,   
            exchangeType: 1, 
            tokens: tokensToUnsub
        });
    }
};
