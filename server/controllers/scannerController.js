import { runScanner } from "../services/scanner/scannerService.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * @desc    Run AI Market Scanner
 * @route   GET /api/scanner
 * @access  Private
 */
export const getScannerResults = catchAsync(async (req, res) => {
    const filters = {
        priceMin: req.query.priceMin,
        priceMax: req.query.priceMax,
        minVolume: req.query.minVolume,
        sector: req.query.sector,
        sentiment: req.query.sentiment,
        minChange: req.query.minChange,
        maxChange: req.query.maxChange,
        sortBy: req.query.sortBy
    };

    const scannerData = await runScanner(filters);

    return res.status(200).json({
        success: true,
        data: scannerData
    });
});

export default {
    getScannerResults
};
