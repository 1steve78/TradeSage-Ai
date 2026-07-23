import { calculatePortfolioSummary, calculateAllocation, calculateSectorDistribution, calculatePerformance } from "../services/analytics/analyticsService.js"

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

export const getAllocation = async(req,res)=>{
    try{
        const data = await calculateAllocation(req.user.id);
        res.json({
            success:true,
            data
        });
    } catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const getSectorDistribution = async(req,res)=>{
    try {
        const data = await calculateSectorDistribution(req.user.id);
        res.json({
            success:true,
            data
        });
    } catch(err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const getDashboardData = async(req,res)=>{
    try {
        const userId = req.user.id;
        
        const [summary, allocationData, sectorData, performanceData] = await Promise.all([
            calculatePortfolioSummary(userId),
            calculateAllocation(userId),
            calculateSectorDistribution(userId),
            calculatePerformance(userId)
        ]);

        res.json({
            success: true,
            data: {
                summary,
                allocation: allocationData.allocation,
                sectors: sectorData.distribution,
                growth: performanceData.growth,
                performance: {
                    bestPerformer: performanceData.bestPerformer,
                    worstPerformer: performanceData.worstPerformer,
                    returns: performanceData.returns
                },
                statistics: performanceData.statistics
            }
        });
    } catch(err) {
        console.error("DASHBOARD ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};