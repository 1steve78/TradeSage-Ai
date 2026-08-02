import { calculateAllocation, calculatePortfolioSummary, calculateSectorDistribution } from "../services/analytics/analyticsService.js"
export { getDashboardData } from "./dashboardController.js";

export const getSummary = async(req,res) =>{
    try{
        const data = await calculatePortfolioSummary(req.user.id);
        
        res.json({
            success : true,
            data,
        });

    }catch(error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
};

export const getAllocation = async (req,res)=>{
    try{
        const data = await calculateAllocation(req.user.id);
        
        res.json({
            success : true,
            data,
        });
    } catch(error) {
        res.status(500).json({
            success :false,
            message : error.message,
        });
    }
};

export const getSectorDistribution = async (req,res)=>{
    try{
        const data = await calculateSectorDistribution(req.user.id);
        
        res.json({
            success : true,
            data,
        });
    } catch(error) {
        res.status(500).json({
            success :false,
            message : error.message,
        });
    }
};