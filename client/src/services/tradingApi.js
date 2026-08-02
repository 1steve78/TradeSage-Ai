import api from "../api/axios";

export const buyStock = async (symbol, companyName, quantity, price) => {
  try {
    const { data } = await api.post("/orders", {
      symbol,
      companyName,
      quantity,
      price,
      side: "BUY",
      orderType: "MARKET"
    });
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to buy stock"
    );
  }
};

export const sellStock = async (symbol, companyName, quantity, price) => {
  try {
    const { data } = await api.post("/orders", {
      symbol,
      companyName,
      quantity,
      price,
      side: "SELL",
      orderType: "MARKET"
    });
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to sell stock"
    );
  }
};

export const getPortfolio = async () => {
  try {
    const response = await api.get("/portfolio");
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch portfolio"
    );
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get("/portfolio/transactions");
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch transactions"
    );
  }
};
export const getPendingOrders = async () => {
  try {
    const response = await api.get("/orders/pending");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch pending orders");
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to cancel order");
  }
};

export const modifyOrder = async (orderId, updates) => {
  try {
    const response = await api.patch(`/orders/${orderId}`, updates);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to modify order");
  }
};

export const getOrderDashboard = async () => {
  try {
    const response = await api.get("/orders/dashboard");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch order dashboard");
  }
};

export const getAnalytics = async () => {
  try {
    const response = await api.get("/orders/analytics");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch analytics");
  }
};
