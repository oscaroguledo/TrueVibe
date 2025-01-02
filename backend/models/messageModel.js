const mongoose = require('mongoose');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for messages
const messageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    default: uuidv4,  // Auto-generate UUID for each message
    unique: true,
  },
  sender_id: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User who sent the message
  },
  channel_id: {
    type: String,
    ref: 'Channel', // Reference to the channel (nullable for direct messages)
    default: null,
  },
  recipient_id: {
    type: String,
    ref: 'User', // For direct messages, recipient is a single user (nullable for group channels)
    default: null,
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'video', 'file'],
    required: true,
  },
  message_content: {
    type: String, // Can store text or media URL (depending on message_type)
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Message sent time
  },
  status: {
    type: String,
    enum: ['sent', 'read', 'deleted'],
    default: 'sent', // Sent by default
  },
  reactions: {
    type: Map,
    of: String, // Key-value pair where the key is emoji and the value is the user ID who reacted
    default: {},
  },
  edited_at: {
    type: Date,
    default: null, // Nullable, will be set if the message is edited
  },
  mentions: [{
    type: String,
    ref: 'User', // Array of user IDs who are mentioned in the message
    default: [],
  }],
});

// Mongoose model for Message
const Message = mongoose.model('Message', messageSchema);

// Joi Validation Schema for Message
const validateMessage = (message) => {
  const schema = Joi.object({
    sender_id: Joi.string()
      .required()
      .messages({
        'any.required': 'Sender ID is required.',
      }),
    channel_id: Joi.string()
      .optional()
      .allow(null) // Channel ID is optional for direct messages
      .messages({
        'string.base': 'Channel ID must be a string.',
      }),
    recipient_id: Joi.string()
      .optional()
      .allow(null) // Recipient ID is optional for group messages
      .messages({
        'string.base': 'Recipient ID must be a string.',
      }),
    message_type: Joi.string()
      .valid('text', 'image', 'video', 'file')
      .required()
      .messages({
        'any.required': 'Message type is required.',
        'string.valid': 'Message type must be one of: text, image, video, or file.',
      }),
    message_content: Joi.string()
      .required()
      .messages({
        'any.required': 'Message content is required.',
      }),
    status: Joi.string()
      .valid('sent', 'read', 'deleted')
      .default('sent')
      .messages({
        'string.valid': 'Status must be one of: sent, read, or deleted.',
      }),
    reactions: Joi.object()
      .pattern(Joi.string(), Joi.string()) // Validate reactions as a map of emoji -> user ID
      .optional()
      .messages({
        'object.base': 'Reactions must be an object.',
      }),
    edited_at: Joi.date()
      .optional()
      .allow(null)
      .messages({
        'date.base': 'Edited time must be a valid date.',
      }),
    mentions: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Mentions must be an array of strings.',
      }),
  });

  return schema.validate(message);
};

// Method to parse and extract mentions from message content
messageSchema.methods.extractMentions = function() {
  const mentions = [];
  const mentionRegex = /@([a-zA-Z0-9_]+)/g; // Regex to find mentions like @username or @userid
  
  let match;
  while ((match = mentionRegex.exec(this.message_content)) !== null) {
    mentions.push(match[1]); // Add the username or user_id to the mentions array
  }
  
  return mentions;
};

// Pre-save hook to extract mentions and update the message before saving
messageSchema.pre('save', async function(next) {
  const mentions = this.extractMentions(); // Extract mentions from message content
  this.mentions = mentions; // Store mentions as an array of usernames or user_ids
  next();
});

module.exports = { Message, validateMessage };
