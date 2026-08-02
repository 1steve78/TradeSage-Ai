import React from "react";
import useNotificationStore from "../../store/notificationStore";

const NotificationCard = ({ notification }) => {
    const { markAsRead, deleteNotification } = useNotificationStore();

    // Visual styles based on type
    const getStyles = (type) => {
        switch (type) {
            case "PRICE_ALERT":
                return { icon: "show_chart", color: "text-blue-500", bg: "bg-blue-500/10" };
            case "ORDER":
                return { icon: "receipt_long", color: "text-gain", bg: "bg-gain/10" };
            case "AI":
                return { icon: "psychology", color: "text-primary", bg: "bg-primary-container" };
            case "NEWS":
                return { icon: "newspaper", color: "text-secondary", bg: "bg-secondary-container" };
            case "PORTFOLIO":
                return { icon: "pie_chart", color: "text-orange-500", bg: "bg-orange-500/10" };
            default:
                return { icon: "info", color: "text-slate-500", bg: "bg-surface-container" };
        }
    };

    const styles = getStyles(notification.type);

    return (
        <div 
            className={`p-md border-b border-outline-variant relative group transition-colors ${
                notification.isRead ? "bg-white opacity-70 hover:opacity-100" : "bg-[#F8FAFC]"
            }`}
        >
            {/* Unread indicator */}
            {!notification.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            )}

            <div className="flex gap-md items-start">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.bg}`}>
                    <span className={`material-symbols-outlined text-[20px] ${styles.color}`}>
                        {styles.icon}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-body-sm font-bold truncate ${notification.isRead ? "text-slate-600" : "text-on-surface"}`}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-label-caps shrink-0 ml-2">
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className={`text-body-sm line-clamp-2 ${notification.isRead ? "text-slate-500" : "text-slate-700"}`}>
                        {notification.message}
                    </p>
                </div>
            </div>

            {/* Actions (Hover) */}
            <div className="absolute right-md bottom-md opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {!notification.isRead && (
                    <button 
                        onClick={() => markAsRead(notification._id)}
                        className="w-6 h-6 bg-white border border-outline-variant rounded flex items-center justify-center hover:text-primary hover:border-primary transition-colors shadow-sm"
                        title="Mark as Read"
                    >
                        <span className="material-symbols-outlined text-[14px]">done</span>
                    </button>
                )}
                <button 
                    onClick={() => deleteNotification(notification._id)}
                    className="w-6 h-6 bg-white border border-outline-variant rounded flex items-center justify-center hover:text-loss hover:border-loss transition-colors shadow-sm"
                    title="Delete"
                >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
            </div>
        </div>
    );
};

export default NotificationCard;
