// controllers/notificationController.js
const Notification = require("../models/Notification.models")

const getNotifications = async (req, res) => {
    const notifDoc = await Notification.findOne({ user: req.user._id });
    res.json(notifDoc ? notifDoc.notifications : []);
};

const saveNotification = async (req, res) => {
    const { notification } = req.body;

    let notifDoc = await Notification.findOne({ user: req.user._id });

    if (!notifDoc) {
        notifDoc = new Notification({ user: req.user._id, notifications: [notification] });
    } else {
        // avoid duplicates
        const exists = notifDoc.notifications.some(n => n._id === notification._id);
        if (!exists) {
            notifDoc.notifications.unshift(notification);
        }
    }

    await notifDoc.save();
    res.status(201).json(notifDoc.notifications);
};

const removeNotification = async (req, res) => {
    const { chatId } = req.body;

    const notifDoc = await Notification.findOne({ user: req.user._id });
    if (notifDoc) {
        notifDoc.notifications = notifDoc.notifications.filter(n => n.chat._id !== chatId);
        await notifDoc.save();
    }

    res.json(notifDoc ? notifDoc.notifications : []);
};

module.exports = { getNotifications, saveNotification, removeNotification }
