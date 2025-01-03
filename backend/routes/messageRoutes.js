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
} = require('../controller/messageController');

// Create a new message
router.post('/', createMessage);

// Get all messages in a specific channel
router.get('/channel/:channel_id', getMessagesByChannel);

// Get all direct messages for a user
router.get('/user/:user_id/direct', getDirectMessagesByUser);

// Get a single message by message_id
router.get('/:message_id', getMessageById);

// Update (edit) a message
router.put('/:message_id', updateMessage);

// Delete a message (soft delete by changing the status)
router.delete('/:message_id', deleteMessage);

// Add a reaction (emoji) to a message
router.post('/:message_id/reactions', addReactionToMessage);

// Remove a reaction from a message
router.delete('/:message_id/reactions', removeReactionFromMessage);

// Search messages by content
router.get('/search', searchMessages);

// Mark a message as read
router.patch('/:message_id/read', markMessageAsRead);

// Get all messages where a user is mentioned
router.get('/mentions/:user_id', getMessagesWithMentionsForUser);

// Get all reactions for a message
router.get('/:message_id/reactions', getReactionsForMessage);

module.exports = router;
