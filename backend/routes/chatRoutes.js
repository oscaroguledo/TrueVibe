const express = require('express');
const router = express.Router();
const chatControllers = require('../controller/chatController');

// Route to create a new chat (private or channel)
router.post('/', chatControllers.createChat);

// Route to get paginated chats
router.get('/', chatControllers.getChats);

// Route to get a specific chat by ID
router.get('/:chat_id', chatControllers.getChatById);

// Route to update a chat (e.g., change name)
router.put('/:chat_id', chatControllers.updateChat);

// Route to delete a chat
router.delete('/:chat_id', chatControllers.deleteChat);
 

module.exports = router;
