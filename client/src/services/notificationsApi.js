import api from "../api/axios.js";

export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

// Alert APIs
export const getPriceAlerts = async () => {
    const response = await api.get("/notifications/alerts");
    return response.data;
};

export const createPriceAlert = async (data) => {
    const response = await api.post("/notifications/alerts", data);
    return response.data;
};
