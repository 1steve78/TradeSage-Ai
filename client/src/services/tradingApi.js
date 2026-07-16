import api from "../api/axios";

export const buyStock = async (symbol, companyName, quantity) => {
  try {
    const response = await api.post("/trading/buy", {
      symbol,
      companyName,
      quantity,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to buy stock"
    );
  }
};

export const sellStock = async (symbol, companyName, quantity) => {
  try {
    const response = await api.post("/trading/sell", {
      symbol,
      companyName,
      quantity,
    });
    return response.data.data;
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
