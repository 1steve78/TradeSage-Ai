import api from '../api/axios.js';

export const getAllocation = async () => {
    const response = await api.get('/analytics/allocation');
    return response.data.data;
};

export const getSectorDistribution = async () => {
    const response = await api.get('/analytics/sectors');
    return response.data.data;
};

export const getDashboardAnalytics = async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data.data;
};
