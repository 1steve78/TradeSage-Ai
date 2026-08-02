import { getPreferences, updatePreferences } from "../services/dashboard/preferenceService.js";

// @desc    Get user preferences
// @route   GET /api/preferences
export const getUserPreferences = async (req, res) => {
    try {
        const prefs = await getPreferences(req.user._id);
        res.json({ success: true, data: prefs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user preferences
// @route   PATCH /api/preferences
export const updateUserPreferences = async (req, res) => {
    try {
        const allowedUpdates = ["theme", "dashboardLayout", "hiddenWidgets", "favouriteSymbols", "defaultScannerFilters"];
        const updates = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const prefs = await updatePreferences(req.user._id, updates);
        res.json({ success: true, data: prefs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
