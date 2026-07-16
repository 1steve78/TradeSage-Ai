import { searchStocks } from "../services/marketService.js";
import { getHistoricalData } from "../services/market/historyService.js";

export const search = async (req,res)=>{
    try{
        const {q} = req.query;

        const stocks = await searchStocks(q);

        res.status(200).json({
            success : true,
            count : stocks.length ,
            data:stocks,
        });
    } catch (error){
        console.log(error.message);
        res.status(400).json({
            success : false ,
            message:error.message,
        });
    }
};

export const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = "1M" } = req.query;

    const candles = await getHistoricalData(
      symbol.toUpperCase(),
      interval
    );

    res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      interval,
      data: candles,
    });

  } catch (error) {

    console.error("History Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};