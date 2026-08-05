import { searchStocks, getCompanyProfile } from "../services/marketService.js";
import { getHistoricalData } from "../services/market/historyService.js";
import * as smartApiService from "../services/smartApiService.js";
import { calculateSMA, calculateEMA } from "../services/market/indicatorService.js";
import { getMarketMovers } from "../services/marketCronService.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// Helper function to format timestamp in seconds to Angel One's expected format "YYYY-MM-DD HH:mm"
const formatSmartApiDate = (timestampSec) => {
    const date = new Date(timestampSec * 1000);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export const search = catchAsync(async (req, res) => {
    const { q } = req.query;
    if (!q) throw new AppError("Search query 'q' is required", 400, "MISSING_QUERY");

    const stocks = await searchStocks(q);

    res.status(200).json({
        success: true,
        count: stocks.length,
        data: stocks,
    });
});

export const getStockHistory = catchAsync(async (req, res) => {
    const { symbol } = req.params;
    const { interval = "1M", exchange, token, from, to, indicators } = req.query;

    let finalCandles = [];
    let smartApiInterval = "ONE_DAY";

    // If exchange and token are provided, use Angel One SmartAPI
    if (exchange && token) {
      const intervalMap = {
        "1": "ONE_MINUTE",
        "3": "THREE_MINUTE",
        "5": "FIVE_MINUTE",
        "15": "FIFTEEN_MINUTE",
        "30": "THIRTY_MINUTE",
        "60": "ONE_HOUR",
        "D": "ONE_DAY",
        "1D": "ONE_DAY",
        "1M": "ONE_DAY",
      };

      smartApiInterval = intervalMap[interval] || "ONE_DAY";

      let toDateStr, fromDateStr;
      if (from && to) {
        toDateStr = formatSmartApiDate(Number(to));
        fromDateStr = formatSmartApiDate(Number(from));
      } else {
        const nowSec = Math.floor(Date.now() / 1000);
        const thirtyDaysAgoSec = nowSec - 30 * 24 * 60 * 60;
        toDateStr = formatSmartApiDate(nowSec);
        fromDateStr = formatSmartApiDate(thirtyDaysAgoSec);
      }

      console.log(`SmartAPI Candle Request: symbol=${symbol}, exchange=${exchange}, token=${token}, interval=${smartApiInterval}, from=${fromDateStr}, to=${toDateStr}`);
      const candles = await smartApiService.getHistoricalCandles({
        exchange,
        symboltoken: token,
        interval: smartApiInterval,
        fromdate: fromDateStr,
        todate: toDateStr
      });

      // Normalize SmartAPI array of arrays format:
      // [["2021-03-01T09:15:00+05:30", open, high, low, close, volume], ...]
      const normalizedCandles = candles.map(c => {
        if (Array.isArray(c)) {
          const parsedTime = Math.floor(new Date(c[0]).getTime() / 1000);
          return {
            time: parsedTime,
            open: Number(c[1]),
            high: Number(c[2]),
            low: Number(c[3]),
            close: Number(c[4]),
            volume: Number(c[5])
          };
        } else {
          const parsedTime = Math.floor(new Date(c.time || c.date).getTime() / 1000);
          return {
            time: parsedTime,
            open: Number(c.open),
            high: Number(c.high),
            low: Number(c.low),
            close: Number(c.close),
            volume: Number(c.volume)
          };
        }
      });

      finalCandles = normalizedCandles;
    } else {
      // Otherwise, fall back to Finnhub
      finalCandles = await getHistoricalData(
        symbol.toUpperCase(),
        interval
      );
    }

    const resultIndicators = {};
    if (indicators && finalCandles.length > 0) {
      const sortedCandles = [...finalCandles].sort((a, b) => a.time - b.time);
      const indicatorList = indicators.split(",").map(i => i.trim().toLowerCase());
      
      indicatorList.forEach(ind => {
        if (ind.startsWith("sma")) {
          const period = parseInt(ind.replace("sma", ""), 10);
          if (period && period > 0) {
            resultIndicators[ind] = calculateSMA(sortedCandles, period);
          }
        } else if (ind.startsWith("ema")) {
          const period = parseInt(ind.replace("ema", ""), 10);
          if (period && period > 0) {
            resultIndicators[ind] = calculateEMA(sortedCandles, period);
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      exchange: exchange || null,
      token: token || null,
      interval: exchange && token ? smartApiInterval : interval,
      data: finalCandles,
      indicators: resultIndicators
    });
});

export const getQuote = catchAsync(async (req, res) => {
    const { exchange, token } = req.query;
    if (!exchange || !token) {
      throw new AppError("Missing exchange or token query parameter.", 400, "MISSING_PARAMETERS");
    }

    const ltpData = await smartApiService.getLTP({ exchange, symboltoken: token });

    res.status(200).json({
      success: true,
      data: {
        exchange: ltpData.exchange,
        tradingSymbol: ltpData.tradingSymbol,
        symbolToken: ltpData.symbolToken,
        ltp: ltpData.ltp,
        close: ltpData.close,
        open: ltpData.open,
        high: ltpData.high,
        low: ltpData.low
      }
    });
});

export const getDepth = catchAsync(async (req, res) => {
    const { exchange, token } = req.query;
    if (!exchange || !token) {
      throw new AppError("Missing exchange or token query parameter.", 400, "MISSING_PARAMETERS");
    }

    const depthData = await smartApiService.getMarketDepth({ exchange, symboltoken: token });

    res.status(200).json({
      success: true,
      data: depthData
    });
});

export const getOptions = catchAsync(async (req, res) => {
    const { exchange, token, expiry } = req.query;
    if (!exchange || !token) {
      throw new AppError("Missing exchange or token query parameter.", 400, "MISSING_PARAMETERS");
    }

    const optionData = await smartApiService.getOptionChain({
      exchange,
      symboltoken: token,
      expirydate: expiry
    });

    res.status(200).json({
      success: true,
      data: optionData
    });
});

export const getCompanyInfo = catchAsync(async (req, res) => {
    const { symbol } = req.params;
    
    // Pass the symbol directly to our new SmartAPI-backed getCompanyProfile
    const profile = await getCompanyProfile(symbol);

    res.status(200).json({
      success: true,
      data: {
        symbol: symbol,
        companyName: profile.name || symbol,
        exchange: profile.exchange || req.query.exchange || "N/A",
        industry: profile.finnhubIndustry || "N/A",
        sector: profile.finnhubIndustry || "N/A",
        marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : null,
        currency: profile.currency || "INR",
        logo: profile.logo || null,
        weburl: null,
      }
    });
});

export const getMarketMoversData = catchAsync(async (req, res) => {
    const data = getMarketMovers();
    res.status(200).json({
      success: true,
      data: data
    });
});