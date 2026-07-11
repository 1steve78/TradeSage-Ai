import { searchStocks } from "../services/marketService.js";

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