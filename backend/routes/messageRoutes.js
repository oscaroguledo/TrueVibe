const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessagesByChannel,
  getDirectMessagesByUser,
  getMessageById,
  updateMessage,
  deleteMessage,
  addReactionToMessage,
  removeReactionFromMessage,
  searchMessages,
  markMessageAsRead,
  getMessagesWithMentionsForUser,
  getReactionsForMessage
} = require('../controllers/messageController');

// Create a new message
router.post('/api/messages', createMessage);

// Get all messages in a specific channel
router.get('/api/messages/channel/:channel_id', getMessagesByChannel);

// Get all direct messages for a user
router.get('/api/messages/user/:user_id/direct', getDirectMessagesByUser);

// Get a single message by message_id
router.get('/api/messages/:message_id', getMessageById);

// Update (edit) a message
router.put('/api/messages/:message_id', updateMessage);

// Delete a message (soft delete by changing the status)
router.delete('/api/messages/:message_id', deleteMessage);

// Add a reaction (emoji) to a message
router.post('/api/messages/:message_id/reactions', addReactionToMessage);

// Remove a reaction from a message
router.delete('/api/messages/:message_id/reactions', removeReactionFromMessage);

// Search messages by content
router.get('/api/messages/search', searchMessages);

// Mark a message as read
router.patch('/api/messages/:message_id/read', markMessageAsRead);

// Get all messages where a user is mentioned
router.get('/api/messages/mentions/:user_id', getMessagesWithMentionsForUser);

// Get all reactions for a message
router.get('/api/messages/:message_id/reactions', getReactionsForMessage);

module.exports = router;
