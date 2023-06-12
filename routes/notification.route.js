const router = require("express").Router();

const {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotificationById,
    deleteNotificationById,
    sendNotificationToAll,
} = require("../controllers/notification.controller");

router.post("/", sendNotificationToAll);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotificationById);
router.delete("/:id", deleteNotificationById);
module.exports = router;
