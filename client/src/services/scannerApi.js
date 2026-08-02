import api from "../api/axios.js";

export const getScannerResults = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        // Only append defined, non-empty filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && value !== "All") {
                queryParams.append(key, value);
            }
        });

        const response = await api.get(`/scanner?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch scanner results";
    }
};
