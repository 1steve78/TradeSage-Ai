import React, { useState, useEffect } from "react";
import NotificationDrawer from "./NotificationDrawer";
import useNotificationStore from "../../store/notificationStore";
import useAuthStore from "../../store/authStore";
import useSocket from "../../hooks/useSocket";

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { fetchNotifications, getUnreadCount, addNotification } = useNotificationStore();
    const { user } = useAuthStore();
    const { socket } = useSocket();

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Listen for live socket events
            const handleNewNotification = (notification) => {
                addNotification(notification);
            };

            socket.on("NOTIFICATION_CREATED", handleNewNotification);

            return () => {
                socket.off("NOTIFICATION_CREATED", handleNewNotification);
            };
        }
    }, [user, fetchNotifications, addNotification]);

    const unreadCount = getUnreadCount();

    return (
        <div className="relative">
            <button 
                id="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 rounded transition-colors cursor-pointer relative ${
                    isOpen ? "bg-surface-container-low text-primary" : "hover:bg-surface-container-low text-slate-500 hover:text-[#0f172a]"
                }`}
                title="Notifications"
            >
                <span className="material-symbols-outlined text-lg">
                    {isOpen ? "notifications_active" : "notifications"}
                </span>
                
                {/* Unread dot */}
                {unreadCount > 0 && (
                    <div className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-loss border-2 border-white animate-pulse"></div>
                )}
            </button>

            <NotificationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default NotificationBell;
