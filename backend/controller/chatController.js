const { logAuditAction } = require('../utils/logAuditAction');
const Chat = require('../models/chatModel');
const Channel = require('../models/channel/channelModel');
const User = require('../models/userModel');
const { paginate } = require('../utils/paginationUtil');

// Create a new chat (private or channel)
const createChat = async (req, res) => {
    try {
        const { chat_type,chat_name, other_user_id, channel_id } = req.body;

        let newChat = {
            chat_type,
            channel_id: chat_type === 'channel' ? channel_id : null,
        };

        // Set chat_name based on chat_type
        if (chat_type === 'private') {
            // For private chat, fetch the other user's name
            const otherUser = await User.findById(other_user_id);
            if (!otherUser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            newChat.chat_name = chat_name || otherUser.username; // Set the name of the other party
        } else if (chat_type === 'channel') {
            // For channel chat, fetch the channel name
            const channel = await Channel.findById(channel_id);
            if (!channel) {
                return res.status(404).json({ success: false, message: 'Channel not found' });
            }
            newChat.chat_name = chat_name || channel.channel_name; // Set the channel's name
        }

        // Create chat
        const chat = new Chat(newChat);
        await chat.save();

        // Log the action
        if (chat_type === 'channel') {
        await logAuditAction(
            req.user.user_id,
            'create',
            `Created a new channel: ${newChat.chat_name}`,
            { channel_id: channel_id }
        );
        }

        res.status(201).json({
        success: true,
        message: 'Chat created successfully',
        data: chat,
        });
    } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: err.message });
    }
};

const getChats = async (req, res) => {
    try {
      const { page = 1, limit = 10, chat_type, channel_id } = req.query;
      const query = {};
  
      if (chat_type) query.chat_type = chat_type;
      if (channel_id) query.channel_id = channel_id;
  
      // Get paginated data
      const result = await paginate(Chat, query, page, limit);
  
      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
const getChatById = async (req, res) => {
    try {
      const { chat_id } = req.params;
      const chat = await Chat.findOne({ chat_id });
  
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Chat found',
        data: chat,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

const updateChat = async (req, res) => {
    try {
      const { chat_id } = req.params;
      const { chat_type, new_chat_name } = req.body;
  
      // Find the chat to be updated
      const chat = await Chat.findOne({ chat_id });
  
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }

      // Update chat_name based on chat_type
      if (chat_type === 'private') {
        
        chat.chat_name = new_chat_name;
      }
  
      // Save the updated chat
      await chat.save();
      // Log the update action
        await logAuditAction(
            req.user.user_id,
            'update',
            `Updated chat ${chat._id}`,
            { chat_id: chat._id, chat_type }
        );
      res.status(200).json({
        success: true,
        message: 'Chat updated successfully',
        data: chat,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  const deleteChat = async (req, res) => {
    try {
      const { chat_id } = req.params;
  
      // Find the chat
      const chat = await Chat.findOne({ chat_id });
  
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
  
      // Log the action (Audit)
      await logAuditAction(
        req.user.user_id,
        'delete',
        `Deleted chat: ${chat.chat_id}`,
        { chat_id: chat.chat_id }
      );
  
      // Delete the chat
      await chat.remove();
  
      res.status(200).json({
        success: true,
        message: 'Chat deleted successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
    
  module.exports = {
    createChat,
    getChatById,
    getChats,
    updateChat,
    deleteChat
  };
  