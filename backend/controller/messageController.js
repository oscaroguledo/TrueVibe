const { Message } = require('../models/Message');
const { User } = require('../models/User');
const { Channel } = require('../models/Channel');
const { ChannelMember } = require('../models/ChannelMember');

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
const getMessagesByChannel = async (req, res) => {
  try {
    const { channel_id } = req.params;
    
    const channel = await Channel.findOne({ channel_id });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const messages = await Message.find({ channel_id }).sort({ timestamp: 1 });

    if (messages.length === 0) return res.status(404).json({ message: 'No messages found for this channel' });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get All Direct Messages for a User
const getDirectMessagesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const directMessages = await Message.find({
      $or: [
        { sender_id: user_id },
        { recipient_id: user_id },
      ],
    }).sort({ timestamp: 1 });

    if (directMessages.length === 0) return res.status(404).json({ message: 'No direct messages found' });

    return res.status(200).json({ directMessages });
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
    const { message_id } = req.params;
    const { message_content, status, reactions, mentions } = req.body;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.message_content = message_content || message.message_content;
    message.status = status || message.status;
    message.reactions = reactions || message.reactions;
    message.mentions = mentions || message.mentions;
    message.edited_at = Date.now();

    await message.save();

    return res.status(200).json({ message: 'Message updated successfully', message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 6. Delete a Message
const deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.params;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.status = 'deleted';
    await message.save();

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
      return res.status(200).json({ message: 'Reaction removed successfully', message });
    }

    return res.status(404).json({ message: 'Reaction not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 9. Search Messages by Content
const searchMessages = async (req, res) => {
  try {
    const { query } = req.query;

    const messages = await Message.find({
      message_content: { $regex: query, $options: 'i' },
    });

    if (!messages.length) return res.status(404).json({ message: 'No messages found' });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 10. Mark Message as Read
const markMessageAsRead = async (req, res) => {
  try {
    const { message_id } = req.params;

    const message = await Message.findOne({ message_id });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.status = 'read';
    await message.save();

    return res.status(200).json({ message: 'Message marked as read' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 11. Get Messages Mentions for a User
const getMessagesWithMentionsForUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const messages = await Message.find({
      mentions: user_id,
    });

    if (!messages.length) return res.status(404).json({ message: 'No messages found with mentions for this user' });

    return res.status(200).json({ messages });
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
