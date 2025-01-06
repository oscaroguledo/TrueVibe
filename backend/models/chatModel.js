const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Chat schema definition
const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Chat ID is required'], // Make chat_id required
    unique: true, // Ensure chat_id is unique
    default: uuidv4, // Generate UUID as default value
    validate: {
      validator: function(v) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v); // UUID pattern check
      },
      message: props => `${props.value} is not a valid UUID!`
    }
  },
  chat_name: {
    type: String,
    required: [true, 'Chat Name is required'], // Make chat_name required
    unique: true, // Ensure chat_id is unique
    
  },
  chat_type: {
    type: String,
    enum: ['private', 'channel'],
    required: [true, 'Chat type is required'],
    validate: {
      validator: function(v) {
        return ['private', 'channel'].includes(v); // Validate that chat_type is either 'private' or 'channel'
      },
      message: props => `${props.value} is not a valid chat type!`
    }
  },
  channel_id: {
    type: String,
    ref: 'Channel', // Reference to Channel (nullable for private chat)
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v); // If channel_id is provided, it should be a valid UUID
      },
      message: props => `${props.value} is not a valid UUID for channel_id!`
    }
  }
}, { timestamps: true });

// Create and export the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
