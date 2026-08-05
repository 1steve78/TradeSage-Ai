import Notification from "../models/Notification.js";
import PriceAlert from "../models/PriceAlert.js";
import { refreshAlertsCache } from "../services/notification/alertEngine.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get all notifications for user
// @route   GET /api/notifications
export const getNotifications = catchAsync(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    
    res.json({ success: true, data: notifications });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
export const markAsRead = catchAsync(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true },
        { new: true }
    );
    res.json({ success: true, data: notification });
});

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
export const markAllAsRead = catchAsync(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
    );
    res.json({ success: true });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = catchAsync(async (req, res) => {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
});

// --- Price Alerts endpoints for completeness ---

export const getPriceAlerts = catchAsync(async (req, res) => {
    const alerts = await PriceAlert.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: alerts });
});

export const createPriceAlert = catchAsync(async (req, res) => {
    const { symbol, condition, target } = req.body;
    const alert = await PriceAlert.create({
        user: req.user._id,
        symbol,
        condition,
        target
    });
    refreshAlertsCache();
    res.status(201).json({ success: true, data: alert });
});
