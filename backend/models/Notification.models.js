const mongoose = require("mongoose")


const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    notifications: [
        {
            type: Object, // stores the full notification object (message, chat, etc.)
            required: true
        }
    ]
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification

