import { create } from "zustand";
import axiosInstance from "../api/axios";

const useDashboardStore = create((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  fetchDashboard: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/dashboard${forceRefresh ? '?forceRefresh=true' : ''}`);
      set({ dashboardData: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      set({
        error: error.response?.data?.message || "Failed to load dashboard data",
        isLoading: false,
      });
    }
  },
}));

export default useDashboardStore;
