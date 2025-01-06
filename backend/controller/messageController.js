const { Message } = require('../models/messageModel');
const { User } = require('../models/userModel');
const { Channel } = require('../models/channel/channelModel');
const { ChannelMember } = require('../models/channel/channelMember');
const { paginate } = require('../utils/paginationUtil');  // Import pagination utility
const { logAuditAction } = require('../utils/logAuditAction');
const Chat = require('../models/chatModel');

// 1. Create a New Message
const createMessage = async (req, res) => {
  try {
    const { sender_id, channel_id, recipient_id, message_type, message_content, reactions, mentions } = req.body;
    
    // Validate sender and recipient
    const sender = await User.findById(sender_id);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    let channel = null;
    if (channel_id) {
      channel = await Channel.findOne({ channel_id });
      if (!channel) return res.status(404).json({ message: 'Channel not found' });
    }

    let recipient = null;
    if (recipient_id) {
      recipient = await User.findById(recipient_id);
      if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create the message object
    const message = new Message({
      sender_id,
      channel_id,
      recipient_id,
      message_type,
      message_content,
      reactions,
      mentions,
    });

    // Save the message to the database
    await message.save();

    // Log the action in the background
    await logAuditAction(
      sender_id,
      'create',
      `Sent a Message: ${message._id}`,
      { message_id: message._id}
    );
    
    return res.status(201).json({
      message: 'Message created successfully',
      message,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 2. Get All Messages in a Channel
// Get all messages in a channel with pagination
const getMessagesByChannel = async (req, res) => {
  try {
    const { channel_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters (default: page 1, limit 10)

    // Validate the channel
    const channel = await Channel.findOne({ channel_id });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    // Use the paginate utility to fetch paginated messages for the channel
    const { data: messages, pagination } = await paginate(Message, { channel_id }, page, limit, { timestamp: 1 });

    return res.status(200).json({
      messages,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// 2. Get All Messages in a Chat
// Get all messages in a chat with pagination
const getMessagesByChat = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters (default: page 1, limit 10)

    // Validate the chat
    const chat = await Chat.findOne({ chat_id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Use the paginate utility to fetch paginated messages for the channel
    const { data: messages, pagination } = await paginate(Message, { chat_id }, page, limit, { timestamp: 1 });

    return res.status(200).json({
      messages,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get All Direct Messages for a User
// Get all direct messages for a user with pagination
const getDirectMessagesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters (default: page 1, limit 10)

    // Validate the user
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Use the paginate utility to fetch paginated direct messages
    const { data: directMessages, pagination } = await paginate(Message, {
      $or: [
        { sender_id: user_id },
        { recipient_id: user_id },
      ],
    }, page, limit, { timestamp: 1 });

    if (directMessages.length === 0) return res.status(404).json({ message: 'No direct messages found' });

    return res.status(200).json({
      directMessages,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get a Single Message
const getMessageById = async (req, res) => {
  try {
    const { message_id } = req.params;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    return res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 5. Update (Edit) a Message
const updateMessage = async (req, res) => {
  try {
    const { message_id, user_id } = req.params;
    const { message_content, status, reactions, mentions } = req.body;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.message_content = message_content || message.message_content;
    message.status = status || message.status;
    message.reactions = reactions || message.reactions;
    message.mentions = mentions || message.mentions;
    message.edited_at = Date.now();

    await message.save();
    
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a Message: ${message._id}`,
      { message_id: message._id}
    );
 
    return res.status(200).json({ message: 'Message updated successfully', message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 6. Delete a Message
const deleteMessage = async (req, res) => {
  try {
    const { user_id, message_id } = req.params;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.status = 'deleted';
    await message.save();
        
    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted a Message: ${message._id}`,
      { message_id: message._id}
    );
 
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 7. Add Reaction to a Message
const addReactionToMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    const { emoji, user_id } = req.body;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (!message.reactions) message.reactions = {};

    message.reactions[emoji] = user_id;
    await message.save();
        
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Added a Message Reaction: ${message._id}`,
      { message_id: message._id}
    );
 
    return res.status(200).json({ message: 'Reaction added successfully', message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 8. Remove Reaction from a Message
const removeReactionFromMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    const { emoji, user_id } = req.body;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.reactions[emoji] === user_id) {
      delete message.reactions[emoji];
      await message.save();
          
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Removed a Message Reaction: ${message._id}`,
      { message_id: message._id}
    );
 
      return res.status(200).json({ message: 'Reaction removed successfully', message });
    }

    return res.status(404).json({ message: 'Reaction not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 9. Search Messages by Content
// Search messages with pagination
const searchMessages = async (req, res) => {
  try {
    const { query } = req.query;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters (default: page 1, limit 10)

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Use the paginate utility to search and paginate messages
    const { data: messages, pagination } = await paginate(Message, 
      { message_content: { $regex: query, $options: 'i' } }, // Search by message content (case-insensitive)
      page, 
      limit, 
      { timestamp: 1 } // Optionally, you can sort the results by timestamp
    );

    if (messages.length === 0) return res.status(404).json({ message: 'No messages found' });

    return res.status(200).json({
      messages,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 10. Mark Message as Read
const markMessageAsRead = async (req, res) => {
  try {
    const { message_id, user_id } = req.params;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.status = 'read';
    await message.save();
        
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Marked a Message as Read: ${message._id}`,
      { message_id: message._id}
    );
 
    return res.status(200).json({ message: 'Message marked as read' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 11. Get Messages Mentions for a User
// Get messages with mentions for a specific user with pagination
const getMessagesWithMentionsForUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters (default: page 1, limit 10)

    // Use the paginate utility to fetch paginated messages with mentions for the user
    const { data: messages, pagination } = await paginate(Message, {
      mentions: user_id,
    }, page, limit);

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found with mentions for this user' });
    }

    return res.status(200).json({
      messages,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 12. Get Reactions for a Message
const getReactionsForMessage = async (req, res) => {
  try {
    const { message_id } = req.params;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    return res.status(200).json({ reactions: message.reactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMessage,
  getMessagesByChannel,
  getMessagesByChat,
  getDirectMessagesByUser,
  getMessageById,
  updateMessage,
  deleteMessage,
  addReactionToMessage,
  removeReactionFromMessage,
  searchMessages,
  markMessageAsRead,
  getMessagesWithMentionsForUser,
  getReactionsForMessage,
};
