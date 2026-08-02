import Notification from "../models/Notification.js";
import PriceAlert from "../models/PriceAlert.js";
import { refreshAlertsCache } from "../services/notification/alertEngine.js";

// @desc    Get all notifications for user
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );
        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Price Alerts endpoints for completeness ---

export const getPriceAlerts = async (req, res) => {
    try {
        const alerts = await PriceAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPriceAlert = async (req, res) => {
    try {
        const { symbol, condition, target } = req.body;
        const alert = await PriceAlert.create({
            user: req.user._id,
            symbol,
            condition,
            target
        });
        refreshAlertsCache();
        res.status(201).json({ success: true, data: alert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
