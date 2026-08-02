import { runScanner } from "../services/scanner/scannerService.js";

/**
 * @desc    Run AI Market Scanner
 * @route   GET /api/scanner
 * @access  Private
 */
export const getScannerResults = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error in getScannerResults controller:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to run market scanner",
        });
    }
};

export default {
    getScannerResults
};
