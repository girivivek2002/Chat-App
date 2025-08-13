const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { sendMessage, allMessage, deleteChatMsg } = require('../controllers/messageController')

const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessage)
router.route('/delete').put(protect, deleteChatMsg)

module.exports = router