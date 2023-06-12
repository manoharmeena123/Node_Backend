const Notification = require("../models/notification");
const { createResponse } = require("../utils/response");
const User = require("../models/user");
// Create a notification
const sendNotificationToAll = async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        let query = {};
        if (userId) {
            query = { userId };
        }
        // Find all users
        const users = await User.find(query).lean().select({ _id: 1 });

        // Create notification for each user
        const notifications = users.map((user) => ({
            userId: user._id,
            title: title,
            message: message,
        }));

        // Create notifications in the database
        await Notification.insertMany(notifications);
        if (userId) {
            return createResponse(res, 200, "Notification sent successfully");
        }
        // Return success response
        return createResponse(
            res,
            200,
            "Notifications sent to all users successfully"
        );
    } catch (err) {
        console.error(err);
        return createResponse(
            res,
            500,
            "Failed to send notifications to all users"
        );
    }
};

module.exports = { sendNotificationToAll };
const createNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        if (!message) {
            return createResponse(res, 400, "Message is required", null);
        }
        const notification = new Notification({
            userId,
            title,
            message,
        });
        const savedNotification = await notification.save();
        createResponse(
            res,
            201,
            "Notification created successfully!",
            savedNotification
        );
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server Error", null);
    }
};

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        let query = {};
        if (req.query.userId) {
            query.userId = req.query.userId;
        }
        const notifications = await Notification.find(query).sort({
            createdAt: -1,
        });
        createResponse(
            res,
            200,
            "Notifications retrieved successfully!",
            notifications
        );
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server Error", null);
    }
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found!",
                data: null,
            });
        }
        createResponse(
            res,
            200,
            "Notification retrieved successfully!",
            notification
        );
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server Error", null);
    }
};

// Update a notification by ID
const updateNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return createResponse(res, 404, "Notification not found!", null);
        }
        notification.set(req.body);
        notification.isRead = req.body.isRead ? true : false;
        const updatedNotification = await notification.save();
        createResponse(
            res,
            200,
            "Notification updated successfully!",
            updatedNotification
        );
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server Error", null);
    }
};

// Delete a notification by ID
const deleteNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(
            req.params.id
        );
        if (!notification) {
            return createResponse(res, 404, "Notification not found!", null);
        }

        createResponse(res, 200, "Notification deleted successfully!", null);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            data: null,
        });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotificationById,
    deleteNotificationById,
    sendNotificationToAll,
};
