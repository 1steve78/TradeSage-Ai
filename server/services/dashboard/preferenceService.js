import UserPreferences from "../../models/UserPreferences.js";

export const getPreferences = async (userId) => {
    let prefs = await UserPreferences.findOne({ user: userId });
    
    // Auto-create defaults if none exist
    if (!prefs) {
        prefs = await UserPreferences.create({ user: userId });
    }
    
    return prefs;
};

export const updatePreferences = async (userId, updates) => {
    // Upsert to handle edge cases
    const prefs = await UserPreferences.findOneAndUpdate(
        { user: userId },
        { $set: updates },
        { new: true, upsert: true }
    );
    return prefs;
};
