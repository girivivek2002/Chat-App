// routes/notificationRoutes.js
const express = require("express")
const { getNotifications, saveNotification, removeNotification } = require("../controllers/notificationcontroller.js")
const { protect } = require('../middlewares/authMiddleware')


const router = express.Router();

router.get("/", protect, getNotifications); // load notifications
router.post("/", protect, saveNotification); // add a new notification
router.delete("/", protect, removeNotification); // remove notifications for a chat

module.exports = router
