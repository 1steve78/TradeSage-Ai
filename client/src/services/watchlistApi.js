import api from "../api/axios";

export const getWatchlists = async () => {
  try {
    const response = await api.get("/watchlists");
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch watchlists"
    );
  }
};

export const createWatchlist = async (name) => {
  try {
    const response = await api.post("/watchlists", {
      name,
    });

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to create watchlist"
    );
  }
};

export const renameWatchlist = async (
  id,
  name
) => {
  try {
    const response = await api.patch(
      `/watchlists/${id}`,
      { name }
    );

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to rename watchlist"
    );
  }
};

export const deleteWatchlist = async (id) => {
  try {
    await api.delete(`/watchlists/${id}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to delete watchlist"
    );
  }
};

export const addStock = async (
  watchlistId,
  stock
) => {
  try {
    const response = await api.post(
      `/watchlists/${watchlistId}/stocks`,
      stock
    );

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to add stock"
    );
  }
};

export const removeStock = async (
  watchlistId,
  symbol
) => {
  try {
    const response = await api.delete(
      `/watchlists/${watchlistId}/stocks/${symbol}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to remove stock"
    );
  }
};