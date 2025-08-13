const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModels");
const User = require("../models/user.models");
const Chat = require("../models/Chat.models");


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        throw new Error("All field are rquired");

    }
    var newmessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newmessage)

        message = await message.populate("sender", "name image")
        message = await message.populate("chat")
        message = await User.populate(message, {  // populate all user detail
            path: "chat.users",
            select: "name email image"
        })


        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        console.log(error)
    }

})

const allMessage = asyncHandler(async (req, res) => {
    try {
        var fetchmessage = await Message.find(
            {
                chat: req.params.chatId,
                deletedBy: { $ne: req.user._id } // ne = not equal to     // it show only messages where login user not in deletedby array
            })
            .populate("sender", "name image email")
            .populate("chat")
        // populate all user deatil
        fetchmessage = await User.populate(fetchmessage, {
            path: "chat.users",
            select: "name email image"
        })
        res.json(fetchmessage)
    } catch (error) {
        console.log(error)
    }
})

const deleteChatMsg = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user._id    // login user

        if (!chatId) {
            return res.status(400).json({ error: "chatId is required" });
        }

        const deletedChatmsg = await Message.updateMany(
            { chat: chatId },
            { $addToSet: { deletedBy: userId } });   // it will add login user to deletedby array in message model

        if (!deletedChatmsg) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.status(200).json(deletedChatmsg);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
})

module.exports = { sendMessage, allMessage, deleteChatMsg }