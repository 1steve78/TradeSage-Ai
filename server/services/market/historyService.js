import axios from "axios";

const FINNHUB_URL =
  "https://finnhub.io/api/v1/stock/candle";

const intervalMap = {
  "1D": { resolution: "5", days: 1 },
  "1W": { resolution: "30", days: 7 },
  "1M": { resolution: "D", days: 30 },
  "3M": { resolution: "D", days: 90 },
  "1Y": { resolution: "W", days: 365 },
};

export const getHistoricalData = async (
  symbol,
  interval = "1M"
) => {
  const config =
    intervalMap[interval] ||
    intervalMap["1M"];

  const to = Math.floor(
    Date.now() / 1000
  );

  const from =
    to - config.days * 24 * 60 * 60;

  const { data } = await axios.get(
    FINNHUB_URL,
    {
      params: {
        symbol,
        resolution: config.resolution,
        from,
        to,
        token:
          process.env.FINNHUB_API_KEY,
      },
    }
  );

  if (data.s !== "ok") {
    throw new Error(
      "No historical data found."
    );
  }

  return data.t.map((_, index) => ({
    time: data.t[index],
    open: data.o[index],
    high: data.h[index],
    low: data.l[index],
    close: data.c[index],
    volume: data.v[index],
  }));
};