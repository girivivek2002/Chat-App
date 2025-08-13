// populate means show karna full detail (ex:- instead if user id show me full detail of user)


const asyncHandler = require('express-async-handler')
const User = require('../models/user.models')
const Chat = require('../models/Chat.models')



// this is for one - one chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body  // this is the user we want to  chat (recevier) we send userid of the user when send any chat to him

    if (!userId) {
        console.log("user id is not found")
        return res.sendStatus(400)
    }
    // it find chat if both user satify all condition otherwise make a new data in chat data
    var isChat = await Chat.find({
        isGroupChat: false,   // chat has isGroupchat false
        $and: [ // both condition satisfied
            { users: { $elemMatch: { $eq: req.user._id } } },  // login user  ($eq = equal to)
            { users: { $elemMatch: { $eq: userId } } },  // userId wal user jisse chat karni h
        ]
    }).populate("users", "-password").populate("latestMessage")  // show user all data without password and also show latestmessage data
    //jab ye chat find karega to usme sirf users id ki jagah uska pura data dega and latestMessage ki pura message data dega (check chat model)


    // it is just show sennder all user detail
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name image email"
    })
    // above explanation
    // “In each chat, go inside the latestMessage, and inside that, find the sender(which is a user ID), and replace it with full user details like their name, image, and email.”

    if (isChat.length > 0) { // one - one chat so lenghth is 1
        res.send(isChat[0]) // there is only one chat 
    } else {
        var chatdata = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId] // current user and user we want to caht
        }
        try {
            const createdchat = await Chat.create(chatdata)
            const fullChat = await Chat.findOne({ _id: createdchat._id }).populate("users", "-password")     // find chat by createdchat id
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }


})

// this is for fetch all chats of login user
const fetchChat = asyncHandler(async (req, res) => {
    try {
        await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) // find all chat that include login user
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate({       // it will check if login user delete all msg then it will not show to it untill next message arrive
                path: "latestMessage",
                match: { deletedBy: { $ne: req.user._id } }, // exclude if deleted for this user
                populate: {
                    path: "sender",
                    select: "name image email"
                }
            })
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {  // Result ke anderlatestmessage uske under sender ko khojo and uske under user ke name, image, email ye sab show kar do
                    //"Hey User model, please populate the sender field inside the latestMessage inside this result object."
                    path: "latestMessage.sender",   // path 
                    select: "name image email"
                })

                res.status(200).send(result)
            })
    } catch (error) {
        res.send("there is not chat with this user")
    }
})

// create group it take name and users from frontend
const createGroup = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "please fill all the fields" })
    }

    var users = JSON.parse(req.body.users) // data come from frontend in array it will convert into json format  // users from req.body.users

    if (users.length < 2) {
        return res.status(200).send("more than 2 user are required to form a group chat")

    }

    users.push(req.user) // it will push current user in users in chat data

    try {
        const groupcreate = await Chat.create({
            chatName: req.body.name,    // take ChatName from req.body.name coming from front end
            isGroupChat: true,
            users: users,

            groupAdmin: req.user  // current user

        })

        const fullGroupChat = await Chat.findOne({ _id: groupcreate._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(201).send(fullGroupChat)
    } catch (error) {
        console.log("enable to create group some mistake in createGroup", error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body

    const updateGroupName = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,  // chatName: chatname   if both same then we can write that also
        },
        {
            new: true   // it chane the value otherwise show the previous data
        }
    )

    if (!updateGroupName) {
        res.status(400).send("No data found by chatId")
    } else {
        res.status(201).send(updateGroupName)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
    }
})

// to add user
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body



    const adduser = await Chat.findByIdAndUpdate(
        chatId,
        {

            // $push: { users: userId } // it will push user but we can add same user many time
            $addToSet: { users: userId }  // it prevent duplicate user
        },
        {
            new: true
        }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!adduser) {
        res.status(400).send("No data found by chatId", error.message)
    } else {
        res.status(201).send(adduser)
    }
})


// to remove user
const removeGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body

    const removeuser = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }  // pull out that user
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removeuser) {
        res.status(400).send("No data found by chatId", error.message)
    } else {
        res.status(201).send(removeuser)
    }
})

// const deleteChat = async (req, res) => {
//     try {
//         const { chatId } = req.body;

//         if (!chatId) {
//             return res.status(400).json({ error: "chatId is required" });
//         }

//         const deletedChat = await Chat.findByIdAndDelete(chatId);

//         if (!deletedChat) {
//             return res.status(404).json({ error: "Chat not found" });
//         }

//         res.status(200).json(deletedChat);
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// };


module.exports = { accessChat, fetchChat, createGroup, renameGroup, addToGroup, removeGroup }