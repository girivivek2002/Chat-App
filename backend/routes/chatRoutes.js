const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { accessChat, fetchChat, createGroup, renameGroup, addToGroup, removeGroup, deleteChat } = require("../controllers/chatController");



const router = express.Router()

router.route('/').post(protect, accessChat) // create one - one chat
router.route('/').get(protect, fetchChat)  // get chat
router.route('/group').post(protect, createGroup) // craete group chat
router.route('/rename').put(protect, renameGroup)  // update group chat name
router.route('/groupadd').put(protect, addToGroup)  // add user in group chat
router.route('/groupremove').put(protect, removeGroup)  // remove user from group chat
// router.route('/delete').delete(protect, deleteChat)


module.exports = router


// here protect always check user login or not if login tthen perform next operation
