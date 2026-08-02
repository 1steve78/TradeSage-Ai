import api from "../api/axios.js";

export const getDashboardData = async (forceRefresh = false) => {
    try {
        const response = await api.get(`/dashboard?forceRefresh=${forceRefresh}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch dashboard data";
    }
};
