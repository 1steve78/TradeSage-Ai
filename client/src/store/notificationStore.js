import { create } from "zustand";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../services/notificationsApi";

const useNotificationStore = create((set, get) => ({
    notifications: [],
    loading: false,

    fetchNotifications: async () => {
        try {
            set({ loading: true });
            const res = await getNotifications();
            set({ notifications: res.data || [], loading: false });
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            set({ loading: false });
        }
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications]
        }));
    },

    markAsRead: async (id) => {
        try {
            // Optimistic update
            set((state) => ({
                notifications: state.notifications.map((n) => 
                    n._id === id ? { ...n, isRead: true } : n
                )
            }));
            await markAsRead(id);
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    },

    markAllAsRead: async () => {
        try {
            // Optimistic update
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
            }));
            await markAllAsRead();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    },

    deleteNotification: async (id) => {
        try {
            // Optimistic update
            set((state) => ({
                notifications: state.notifications.filter((n) => n._id !== id)
            }));
            await deleteNotification(id);
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    },

    getUnreadCount: () => {
        return get().notifications.filter(n => !n.isRead).length;
    }
}));

export default useNotificationStore;
