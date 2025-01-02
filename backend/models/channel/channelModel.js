const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

// Channel Schema definition
const channelSchema = new mongoose.Schema({
  channel_id: {
    type: String,
    default: uuidv4, // Automatically generate UUID for each channel
    unique: true
  },
  group_id: { 
    type: String, 
    required: true, 
    ref: 'Group' // FK to Groups collection (group_id)
  },
  channel_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  channel_type: {
    type: String,
    enum: ['public', 'private', 'direct message'],
    required: true
  },
  owner_id: {
    type: String,
    required: true,
    ref: 'User' // FK to Users collection (owner_id)
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
});

// Mongoose model for the channel
const Channel = mongoose.model('Channel', channelSchema);

// Joi validation schema for creating a channel
const validateChannel = (channel) => {
  const schema = Joi.object({
    group_id: Joi.string().required().messages({
      'any.required': 'Group ID is required.'
    }),
    channel_name: Joi.string().min(3).required().messages({
      'string.min': 'Channel name must be at least 3 characters long.',
      'any.required': 'Channel name is required.'
    }),
    channel_type: Joi.string().valid('public', 'private', 'direct message').required().messages({
      'any.required': 'Channel type is required.',
      'any.only': 'Invalid channel type. Valid values are public, private, or direct message.'
    }),
    owner_id: Joi.string().required().messages({
      'any.required': 'Owner ID is required.'
    }),
    status: Joi.string().valid('active', 'archived').default('active'),
  });

  return schema.validate(channel);
};

module.exports = { Channel,validateChannel };

