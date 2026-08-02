import React, { useEffect, useRef } from "react";
import useNotificationStore from "../../store/notificationStore";
import NotificationCard from "./NotificationCard";

const NotificationDrawer = ({ isOpen, onClose }) => {
    const { notifications, loading, fetchNotifications, markAllAsRead, getUnreadCount } = useNotificationStore();
    const drawerRef = useRef();

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target) && !e.target.closest("#notification-bell")) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    const unreadCount = getUnreadCount();

    return (
        <div 
            ref={drawerRef}
            className="absolute top-[60px] right-4 w-[380px] bg-white border border-outline-variant shadow-2xl rounded-lg overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            style={{ maxHeight: "calc(100vh - 80px)" }}
        >
            <div className="flex justify-between items-center p-md border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="font-display-lg text-[16px] font-bold text-on-surface">Notifications</h3>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="text-[11px] font-label-caps font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                        MARK ALL READ
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                {loading && notifications.length === 0 ? (
                    <div className="p-xl text-center text-outline">
                        <span className="material-symbols-outlined animate-spin text-[24px]">sync</span>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map(n => (
                        <NotificationCard key={n._id} notification={n} />
                    ))
                ) : (
                    <div className="p-xl text-center flex flex-col items-center justify-center h-48">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-sm">celebration</span>
                        <p className="text-body-sm font-bold text-slate-500">You're all caught up.</p>
                        <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
                    </div>
                )}
            </div>

            <div className="p-sm border-t border-outline-variant bg-surface-container-lowest text-center">
                <button className="text-[11px] font-label-caps font-bold text-secondary hover:text-primary transition-colors">
                    VIEW ALL SETTINGS
                </button>
            </div>
        </div>
    );
};

export default NotificationDrawer;
